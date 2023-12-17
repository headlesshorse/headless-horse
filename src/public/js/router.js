class Router {
  constructor() {
    this._eventSource = document.createElement("div");
    this._routeChanged = new CustomEvent("routechanged", { bubbles: true, cancelable: false });
    this._route = null;
    window.addEventListener("popstate", () => this._updateRoute());
  }

  get eventSource() {
    return this._eventSource;
  }

  setRoute(slug) {
    window.history.pushState(null, null, `/${slug}`);
    this._route = slug;
    this._eventSource.dispatchEvent(this._routeChanged);
  }

  getRoute() {
    return window.location.pathname.substring(1);
  }

  _updateRoute() {
    const newRoute = this.getRoute();
    if (newRoute !== this._route) {
      this._route = newRoute;
      this._eventSource.dispatchEvent(this._routeChanged);
    }
  }
}

const router = new Router();

export default router;
