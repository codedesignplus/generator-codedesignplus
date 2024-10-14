namespace <%= ns %>;

[Route("api/[controller]")]
[ApiController]
public class <%= name %>(IMediator mediator, IMapper mapper) : ControllerBase
{
    
}
