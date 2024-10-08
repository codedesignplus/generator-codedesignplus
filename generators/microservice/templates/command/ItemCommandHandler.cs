namespace <%= ns %>;

public class <%= name %>CommandHandler(I<%= name %>Repository repository, IUserContext user, IMessage message) : IRequestHandler<<%= name %>Command>
{
    public Task Handle(<%= name %>Command request, CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}