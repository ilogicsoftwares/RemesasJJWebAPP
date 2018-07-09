using Newtonsoft.Json;
using RemesasJJ.Logics;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace RemesasJJWebAPP.Filters
{

    
    public class CustAuthFilter : AuthorizeAttribute
    {

        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            var nombreAct = filterContext.ActionDescriptor.ActionName;
            var nombreController = filterContext.ActionDescriptor.ControllerDescriptor.ControllerName;
            var completename = "/" + nombreController + "/" + nombreAct;
            var mytype = ((ReflectedActionDescriptor)filterContext.ActionDescriptor).MethodInfo.ReturnType.Name;




            MenuRoles roles = new MenuRoles();
            Remesa remex = new Remesa();
            var aceso = remex.context.acesos.FirstOrDefault(x => x.link == completename.ToLower());
            var userid = filterContext.HttpContext.User.Identity.Name == string.Empty ? "0" : filterContext.HttpContext.User.Identity.Name;
            var ActualuserID= int.Parse(userid);
            var usuario = remex.context.users.FirstOrDefault(x => x.id == ActualuserID);
            
          
            if ((usuario!=null && roles.Testrole(usuario.roleid, completename.ToLower()))|| aceso==null)
            {
                filterContext.Controller.ViewBag.AutherizationMessage = "Custom Authorization: Message from OnAuthorization method.";
            }
            else
            {
                if (!mytype.Contains("Json"))
                    filterContext.Result = new RedirectToRouteResult(
                     new RouteValueDictionary{
                   { "action", "notAuth" },
                 { "controller", "Secure" }
                                           });
                else
                {
                    filterContext.Result = new JsonResult()
                    {
                        Data = new  { error = true, errorMsg = "Usuario no Autorizado" },
                        JsonRequestBehavior = JsonRequestBehavior.AllowGet
                    };
                }


            }


        }
    }
}