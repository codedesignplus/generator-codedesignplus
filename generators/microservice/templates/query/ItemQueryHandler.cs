namespace <%= ns %>;

public class <%= name %>QueryHandler(I<%= aggregate %>Repository repository, IMapper mapper) : IRequestHandler<<%= useCase %>Query, <%= aggregate %>Dto>
{
    public Task<<%= aggregate %>Dto> Handle(<%= name %>Query request, CancellationToken cancellationToken)
    {
        return Task.FromResult<<%= aggregate %>Dto>(default!);
    }
}
