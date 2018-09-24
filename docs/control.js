const appPath = "app.json";
const clientBrowser = navigator.userAgent;
const debug = {
    logs: false,
    errors: false,
    DOMLogs: false
}

let app = {};

function log(t) {
    if (debug.logs) console.log(t);
}
function error(t) {
    if (debug.errors) console.error(t);
}
function DOMLog(e, t) {
    if (debug.DOMLogs) e.textContent = t;
}
function scrub(e) {
    e.innerHTML = "";
    log("Workspace was cleared");
}

function get(src, callback, blob) {
    let req = new XMLHttpRequest();
    if (blob == true) {
        req.responseType = "blob";
    }
    req.addEventListener("readystatechange", (e) => {
        let state = e.target;
        if (state.readyState == 4 && state.status == 200 && callback) {
            callback(state);
        }
    });
    req.addEventListener("error", (e) => {
        error("Failed to fetch resource.")
    });
    req.open("get", src, true);
    req.send();
}
function registerComponent(input) {
    let component = JSON.parse(input.response);

    component.src = input.responseURL.replace(window.location, "");
    component.folder = component.src.replace(/[^/]*$/, "");

    component.container = document.createElement("component");
    document.body.appendChild(component.container);


    if (component.workspace) {
        var workspace = document.createElement(component.workspace);
        DOMLog(workspace, `${component.name} v${component.version}`);
        component.workspace = workspace;
        component.container.appendChild(workspace);
    }
    if (component.styles) {
        for (let style of component.styles) {
            get((style.src.includes("http")) ? style.src : component.folder + style.src, (e) => {
                if (style.createURL == true) {
                    let styleLink = document.createElement('link');
                    styleLink.rel = "stylesheet";
                    styleLink.href = URL.createObjectURL(e.response);
                    document.head.appendChild(styleLink);
                }
                else {
                    let styleElement = document.createElement("style");
                    styleElement.innerHTML = e.response;
                    component.container.appendChild(styleElement);
                }
            }, style.createURL);
        }
    }
    if (component.html) {
        get((component.html.src.includes("http")) ? component.html.src : component.folder + component.html.src, (e) => {
            workspace.innerHTML = e.response;
            if (component.scripts) {
                for (let script of component.scripts) {
                    get((script.src.includes("http")) ? script.src : component.folder + script.src, (e) => {
                        let scriptElement = document.createElement('script');
                        scriptElement.type = "text/javascript";
                        scriptElement.src = URL.createObjectURL(e.response);
                        document.head.appendChild(scriptElement);
                    }, true);
                }
            }
        }, false);
    }
    return component;
}

function load(e) {
    DOMLog(document.body, `Detected: ${clientBrowser} - Waiting for server to get app...`);
    get(appPath, (e) => {
        app = JSON.parse(e.response);
        document.title = app.name;
        scrub(document.body);
        for (let component of app.components) {
            get(component, (e) => {
                registerComponent(e);
            }, false);
        }
    });
}
window.addEventListener("DOMContentLoaded", load);