namespace <%= ns %>;

public class <%= name %>(IServiceProvider serviceProvider, IOptions<MongoOptions> mongoOptions, ILogger<<%= name %>> logger) 
    : RepositoryBase(serviceProvider, mongoOptions, logger), <%= interface %>
{
   
}