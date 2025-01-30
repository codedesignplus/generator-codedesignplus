namespace <%= ns %>;

public class <%= handler %>(<%= repository %> repository, IMapper mapper, IUserContext user) : IRequestHandler<<%= name %>, <%= dto %>>
{
    public Task<<%= dto %>> Handle(<%= name %> request, CancellationToken cancellationToken)
    {
        return Task.FromResult<<%= dto %>>(default!);
    }
}
