namespace <%= ns %>;

[DtoGenerator]
public record <%= name %>(Guid Id) : IRequest;

public class Validator : AbstractValidator<<%= name %>>
{
    public Validator()
    {
        RuleFor(x => x.Id).NotEmpty().NotNull();
    }
}
