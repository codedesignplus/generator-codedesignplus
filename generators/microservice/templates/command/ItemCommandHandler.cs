namespace <%= ns %>;

public class <%= useCase %>CommandHandler(I<%= name %>Repository repository, IUserContext user, IMessage message) : IRequestHandler<<%= useCase %>Command>
{
    public Task Handle(<%= useCase %>Command request, CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}