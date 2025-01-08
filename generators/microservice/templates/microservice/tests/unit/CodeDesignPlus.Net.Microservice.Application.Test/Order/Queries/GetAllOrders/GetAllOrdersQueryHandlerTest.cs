using CodeDesignPlus.Net.Microservice.Application.Order.Queries.GetAllOrders;

namespace CodeDesignPlus.Net.Microservice.Application.Test.Order.Queries.GetAllOrders;

public class GetAllOrdersQueryHandlerTest
{

    [Fact]
    public async Task Handle_Success()
    {
        // Arrange
        var criteria = new C.Criteria();
        var query = new GetAllOrdersQuery(criteria);
        var orders = new List<OrderDto>
        {
            new() {
                Id = Guid.NewGuid(),
                Client = new ClientDto(){
                    Name = "Client 1",
                    Document = "123456789",
                    TypeDocument = "CC",
                    Id = Guid.NewGuid()
                },
                CompletedAt = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                CreatedBy = Guid.NewGuid(),
                CreatedAt = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                IsActive = true,
                Products = [
                    new(){
                        Id = Guid.NewGuid(),
                        Name = "Product 1",
                        Price = 100,
                        Quantity = 1
                    }
                ],

            },
            new() {
                Id = Guid.NewGuid(),
                Client = new ClientDto(){
                    Name = "Client 2",
                    Document = "987654321",
                    TypeDocument = "CC",
                    Id = Guid.NewGuid()
                },
                CompletedAt = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                CreatedBy = Guid.NewGuid(),
                CreatedAt = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                IsActive = true,
                Products = [
                    new(){
                        Id = Guid.NewGuid(),
                        Name = "Product 2",
                        Price = 200,
                        Quantity = 2
                    }
                ],

            }
        };

        var orderRepositoryMock = new Mock<IOrderRepository>();
        var mapperMock = new Mock<IMapper>();
        var queryHandler = new GetAllOrdersQueryHandler(orderRepositoryMock.Object, mapperMock.Object);

        mapperMock.Setup(x => x.Map<List<OrderDto>>(It.IsAny<List<OrderAggregate>>())).Returns(orders);

        // Act
        var result = await queryHandler.Handle(query, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.NotEmpty(result);
        Assert.Equal(orders.Count, result.Count);

        orderRepositoryMock.Verify(x => x.MatchingAsync<OrderAggregate>(criteria, It.IsAny<CancellationToken>()), Times.Once);
        mapperMock.Verify(x => x.Map<List<OrderDto>>(It.IsAny<List<OrderAggregate>>()), Times.Once);
    }

}
