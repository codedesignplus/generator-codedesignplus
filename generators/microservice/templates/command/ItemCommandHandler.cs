namespace <%= ns %>;

public class <%= handler %>(<%= repository %> repository, IUserContext user, IPubSub pubsub) : IRequestHandler<<%= name %>>
{
    public Task Handle(<%= name %> request, CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}