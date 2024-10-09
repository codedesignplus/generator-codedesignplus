namespace <%= ns %>;

[DtoGenerator]
public record <%= useCase %>Command(Guid Id) : IRequest;

public class Validator : AbstractValidator<<%= useCase %>Command>
{
    public Validator()
    {
        RuleFor(x => x.Id).NotEmpty().NotNull();
    }
}
