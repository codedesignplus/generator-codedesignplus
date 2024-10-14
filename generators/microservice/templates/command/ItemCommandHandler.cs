namespace <%= ns %>;

public class <%= handler %>(<%= repository %> repository, IUserContext user, IMessage message) : IRequestHandler<<%= name %>>
{
    public Task Handle(<%= name %> request, CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}