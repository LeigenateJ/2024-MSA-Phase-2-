using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Security.Claims;

namespace PersonalFinanceManager.Controllers
{
    [ApiController]
    public abstract class BaseController : ControllerBase
    {
        protected Guid GetUserIdFromToken()
        {
            return Guid.Parse(User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);
        }
    }
}
