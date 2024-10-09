namespace <%= ns %>;

public class <%= useCase %>QueryHandler(I<%= name %>Repository repository, IMapper mapper) : IRequestHandler<<%= useCase %>Query, <%= name %>Dto>
{
    public Task<<%= name %>Dto> Handle(<%= useCase %>Query request, CancellationToken cancellationToken)
    {
        return Task.FromResult<<%= name %>Dto>(default!);
    }
}
