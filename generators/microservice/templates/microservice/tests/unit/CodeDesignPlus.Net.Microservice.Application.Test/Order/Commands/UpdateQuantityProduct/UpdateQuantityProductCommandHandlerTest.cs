using CodeDesignPlus.Net.Microservice.Application.Order.Commands.UpdateQuantityProduct;
using CodeDesignPlus.Net.Microservice.Domain.ValueObjects;

namespace CodeDesignPlus.Net.Microservice.Application.Test.Order.Commands.UpdateQuantityProduct;

public class UpdateQuantityProductCommandHandlerTest
{
    private readonly IUserContext user;

    public UpdateQuantityProductCommandHandlerTest()
    {
        var userMock = new Mock<IUserContext>();

        userMock.Setup(x => x.IdUser).Returns(Guid.NewGuid());
        userMock.Setup(x => x.Tenant).Returns(Guid.NewGuid());

        this.user = userMock.Object;
    }

    [Fact]
    public async Task Should_Throw_Exception_When_Order_Not_Found()
    {
        // Arrange
        var orderRepository = new Mock<IOrderRepository>();
        var pubsub = new Mock<IPubSub>();

        var command = new UpdateQuantityProductCommand(Guid.NewGuid(), Guid.NewGuid(), 1);

        orderRepository.Setup(x => x.FindAsync<OrderAggregate>(It.IsAny<Guid>(), It.IsAny<Guid>(), It.IsAny<CancellationToken>()))!.ReturnsAsync(default(OrderAggregate));

        var handler = new UpdateQuantityProductCommandHandler(orderRepository.Object, this.user, pubsub.Object);

        // Act
        var exception = await Assert.ThrowsAsync<CodeDesignPlusException>(() => handler.Handle(command, CancellationToken.None));

        // Assert
        orderRepository.Verify(x => x.FindAsync<OrderAggregate>(command.Id, this.user.Tenant, It.IsAny<CancellationToken>()), Times.Once);
        orderRepository.Verify(x => x.UpdateQuantityProductAsync(command.Id, this.user.Tenant, It.IsAny<UpdateQuantityProductParams>(), It.IsAny<CancellationToken>()), Times.Never);
        pubsub.Verify(x => x.PublishAsync(It.IsAny<IReadOnlyList<IDomainEvent>>(), It.IsAny<CancellationToken>()), Times.Never);

        Assert.Equal(Errors.OrderNotFound.GetCode(), exception.Code);
        Assert.Equal(Errors.OrderNotFound.GetMessage(), exception.Message);

    }

    [Fact]
    public async Task Handler_Success()
    {
        // Arrange
        var orderRepository = new Mock<IOrderRepository>();
        var pubsub = new Mock<IPubSub>();
        var client = ClientValueObject.Create(Guid.NewGuid(), "client", "1234567890", "CC");
        var address = AddressValueObject.Create("Colombia", "Bogota", "Bogota", "Calle 123", 123456);

        var order = OrderAggregate.Create(Guid.NewGuid(), client, address, this.user.Tenant, this.user.IdUser);

        order.Products.Add(new ProductEntity()
        {
            Id = Guid.NewGuid(),
            Name = "Product",
            Price = 100,
            Quantity = 1
        });

        var command = new UpdateQuantityProductCommand(order.Id, order.Products[0].Id, 2);

        orderRepository.Setup(x => x.FindAsync<OrderAggregate>(It.IsAny<Guid>(), It.IsAny<Guid>(), It.IsAny<CancellationToken>()))!.ReturnsAsync(order);

        var handler = new UpdateQuantityProductCommandHandler(orderRepository.Object, this.user, pubsub.Object);

        // Act
        await handler.Handle(command, CancellationToken.None);

        // Assert        
        Assert.NotNull(order.UpdatedAt);
        Assert.Equal(this.user.IdUser, order.UpdatedBy);
        orderRepository.Verify(x => x.FindAsync<OrderAggregate>(command.Id, this.user.Tenant, It.IsAny<CancellationToken>()), Times.Once);
        orderRepository.Verify(x => x.UpdateQuantityProductAsync(command.Id, this.user.Tenant, It.IsAny<UpdateQuantityProductParams>(), It.IsAny<CancellationToken>()), Times.Once);
        pubsub.Verify(x => x.PublishAsync(It.IsAny<IReadOnlyList<IDomainEvent>>(), It.IsAny<CancellationToken>()), Times.Once);
    }

}
