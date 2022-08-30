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
      res.locals.routes = routes;
    } else {
      res.locals.routes = authRoutes;
    }
    // locals
    next('this is not working');
  };