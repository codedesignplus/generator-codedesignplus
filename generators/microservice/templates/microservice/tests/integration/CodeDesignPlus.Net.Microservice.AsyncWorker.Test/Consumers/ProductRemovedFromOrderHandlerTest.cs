namespace CodeDesignPlus.Net.Microservice.AsyncWorker.Test.Consumers;

public class ProductRemovedFromOrderHandlerTest(Server<Program> server) : ServerBase<Program>(server), IClassFixture<Server<Program>>
{

    [Fact]
    public async Task HandleAsync_Success()
    {
        await Task.Delay(5000);
        
        // Arrange
        var messageService = Services.GetRequiredService<IMessage>();

        var domainEvent = ProductRemovedFromOrderDomainEvent.Create(Guid.NewGuid(), Guid.NewGuid());

        await messageService.PublishAsync(domainEvent, CancellationToken.None);

        await Task.Delay(1000);

        // Act
        var logs = LoggerProvider.Loggers.SelectMany(x => x.Value.Logs).ToList();

        Assert.Contains(logs, log => log.Contains("ProductRemovedFromOrderDomainEvent Recived"));
        Assert.Contains(logs, log => log.Contains(domainEvent.AggregateId.ToString()));
        Assert.Contains(logs, log => log.Contains(JsonConvert.SerializeObject(domainEvent)));
    }
}