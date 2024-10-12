namespace <%= ns %>;

public class <%= name %>QueryHandler(<%= repository %> repository, IMapper mapper) : IRequestHandler<<%= name %>Query, <%= dto %>Dto>
{
    public Task<<%= dto %>Dto> Handle(<%= name %>Query request, CancellationToken cancellationToken)
    {
        return Task.FromResult<<%= dto %>Dto>(default!);
    }
}
