const routes = [
    { href: "/posts/new", title: "New Posts" },
    { href: "/posts", title: "Posts" },
    { href: "/logout", title: "Logout" },
  ];
  
  const authRoutes = [
    { href: "/users/login", title: "Login" },
    { href: "/users/register", title: "Register" },
  ];
  
  module.exports = function navLinks(req, res, next) {
    if (req.session.currentUser) {
        console.log(req.session)
      return res.locals.routes = routes;
    } else {
      return res.locals.routes = authRoutes;
    }
  };