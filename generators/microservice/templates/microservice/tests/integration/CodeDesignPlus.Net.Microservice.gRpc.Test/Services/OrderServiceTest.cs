using CodeDesignPlus.Net.Microservice.Domain.ValueObjects;
using NodaTime;
using NodaTime.Serialization.Protobuf;

namespace CodeDesignPlus.Net.Microservice.gRpc.Test.Services;

public class OrderServiceTest : ServerBase<Program>, IClassFixture<Server<Program>>
{
    public OrderServiceTest(Server<Program> server) : base(server)
    {
        server.InMemoryCollection = (x) =>
        {
            x.Add("Vault:Enable", "false");
            x.Add("Vault:Address", "http://localhost:8200");
            x.Add("Vault:Token", "root");
            x.Add("Solution", "CodeDesignPlus");
            x.Add("AppName", "my-test");
            x.Add("RabbitMQ:UserName", "guest");
            x.Add("RabbitMQ:Password", "guest");
        };
    }

    [Fact]
    public async Task GetOrder_BidirectionalStreaming_ValidId_ReturnsOrder()
    {
        bool isInvoked = false;
        var orderClient = new Orders.OrdersClient(Channel);
        var client = ClientValueObject.Create(Guid.NewGuid(), "CodeDesignPlus", "1234567890", "CC");
        var address = AddressValueObject.Create("Colombia", "Bogota", "Bogota", "Calle 123", 123456);

        var orderExpected = OrderAggregate.Create(Guid.NewGuid(), client, address, Guid.NewGuid(), Guid.NewGuid());

        var repository = Services.GetRequiredService<IOrderRepository>();

        await repository.CreateAsync(orderExpected, CancellationToken.None);

        var metadata = new Metadata
        {
            new("X-Tenant", orderExpected.Tenant.ToString())
        };

        using var streamingCall = orderClient.GetOrder(metadata);

        _ = Task.Run(async () =>
        {
            await foreach (var response in streamingCall.ResponseStream.ReadAllAsync())
            {
                Assert.NotNull(response);
                Assert.Equal(orderExpected.Id.ToString(), response.Order.Id);
                Assert.Equal(orderExpected.Client.Id.ToString(), response.Order.Client.Id);
                Assert.Equal(orderExpected.Client.Name, response.Order.Client.Name);
                Assert.Equal(orderExpected.CreatedBy.ToString(), response.Order.CreatedBy);
                Assert.True(response.Order.CreatedAt.ToInstant() > Instant.MinValue);

                isInvoked = true;
            }
        });

        await streamingCall.RequestStream.WriteAsync(new GetOrderRequest
        {
            Id = orderExpected.Id.ToString()
        });

        await Task.Delay(2000);

        await streamingCall.RequestStream.CompleteAsync();

        Assert.True(isInvoked);
    }

}
