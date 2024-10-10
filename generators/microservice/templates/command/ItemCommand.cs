namespace <%= ns %>;

[DtoGenerator]
public record <%= name %>Command(Guid Id) : IRequest;

public class Validator : AbstractValidator<<%= name %>Command>
{
    public Validator()
    {
        RuleFor(x => x.Id).NotEmpty().NotNull();
    }
}
