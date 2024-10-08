﻿namespace CodeDesignPlus.Net.Microservice.Application.Order.Commands.RemoveProduct;

public class RemoveProductCommandHandler(IOrderRepository orderRepository, IUserContext user, IMessage message) : IRequestHandler<RemoveProductCommand>
{
    public async Task Handle(RemoveProductCommand request, CancellationToken cancellationToken)
    {
        var order = await orderRepository.FindAsync(request.Id, cancellationToken);

        ApplicationGuard.IsNull(order, Errors.OrderNotFound);

        order.RemoveProduct(request.ProductId, user.IdUser);

        await orderRepository.RemoveProductFromOrderAsync(new RemoveProductFromOrderParams() {
            Id = order.Id,
            IdProduct = request.ProductId,
            UpdatedAt = order.UpdatedAt,
            UpdateBy = user.IdUser
        }, cancellationToken);

        await message.PublishAsync(order.GetAndClearEvents(), cancellationToken);
    }
}
