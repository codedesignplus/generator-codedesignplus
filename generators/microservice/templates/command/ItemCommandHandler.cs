﻿namespace <%= ns %>;

public class <%= name %>CommandHandler(I<%= repository %>Repository repository, IUserContext user, IMessage message) : IRequestHandler<<%= name %>Command>
{
    public Task Handle(<%= name %>Command request, CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}