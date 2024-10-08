namespace <%= ns %>;

public class <%= name %>QueryHandler(I<%= name %>Repository repository, IMapper mapper) : IRequestHandler<<%= name %>Query, <%= name %>Dto>
{
    public Task<<%= name %>Dto> Handle(<%= name %>Query request, CancellationToken cancellationToken)
    {
        return Task.FromResult<P<%= name %>Dto>(default!);
    }
}
