namespace <%= ns %>;

public class <%= name %>Repository(IServiceProvider serviceProvider, IOptions<MongoOptions> mongoOptions, ILogger<<%= name %>Repository> logger) 
    : RepositoryBase(serviceProvider, mongoOptions, logger), I<%= name %>Repository
{
   
}