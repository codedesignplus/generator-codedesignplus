﻿namespace <%= ns %>;

public record <%= name %>Query(Guid Id) : IRequest<<%= aggregate %>Dto>;

