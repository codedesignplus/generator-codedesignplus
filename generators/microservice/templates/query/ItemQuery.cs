namespace <%= ns %>;

public record <%= useCase %>Query(Guid Id) : IRequest<<%= name %>Dto>;

