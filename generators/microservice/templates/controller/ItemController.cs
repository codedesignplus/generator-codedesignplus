namespace <%= ns %>;

[Route("api/[controller]")]
[ApiController]
public class <%= name %>Controller(IMediator mediator, IMapper mapper) : ControllerBase
{
    
}
