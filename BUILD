load("//corp/cloud/run:build_defs.bzl", "container_push", "corp_run_image")
load("//javascript/typescript:build_defs.bzl", "ts_development_sources", "ts_library")
load("//tools/build_defs/go:go_binary.bzl", "go_binary")
load("//tools/build_defs/js:rules.bzl", "js_binary")
load("//tools/build_defs/js/devserver:web_dev_server.bzl", "web_dev_server")

task_view_visibility = [
    "//devtools/ai:__subpackages__",
]

package(default_visibility = task_view_visibility)

ts_library(
    name = "lib",
    srcs = [
        "app.tsx",
        "components/Modal.tsx",
        "context/SimulatorContext.tsx",
        "views/AdminState.tsx",
        "views/AgentManager.tsx",
        "views/CSuiteExecutive.tsx",
        "views/ChannelManager.tsx",
        "views/ConsumerAppManager.tsx",
        "views/Dashboard.tsx",
        "views/EndConsumer.tsx",
        "views/GovernanceAdmin.tsx",
        "views/GuidedExperience.tsx",
        "views/BundleManager.tsx",
        "views/BundleOwner.tsx",
        "views/ProfileManager.tsx",
        "views/StorefrontManager.tsx",
        "views/TestBench.tsx",
        "views/ToolManager.tsx",
    ],
    deps = [
        "//third_party/javascript/react/v18:react",
        "//third_party/javascript/react_dom/v18:react_dom",
        "//third_party/javascript/safevalues",
        "//third_party/javascript/safevalues/dom",
    ],
)

ts_library(
    name = "index_ts",
    srcs = [
        "index.tsx",
        "main.tsx",
    ],
    deps = [
        ":lib",
        "//third_party/javascript/react/v18:react",
        "//third_party/javascript/react_dom/v18:react_dom",
        "//third_party/javascript/safevalues",
        "//third_party/javascript/safevalues/dom",
    ],
)

ts_development_sources(
    name = "dev_sources",
    deps = [":index_ts"],
)

web_dev_server(
    name = "devserver",
    concatjs_routes = {
        ":dev_sources": "/index.js",
    },
    static_files = ["index.html"],
)

go_binary(
    name = "server",
    srcs = ["server.go"],
    data = [
        "static/index.html",
        ":bundle",
    ],
    deps = [
        "//base/go:flag",
        "//base/go:log",
        "//base/go:runfiles",
    ],
)

js_binary(
    name = "bundle",
    deps = [
        ":index_ts",
        "//third_party/javascript/react/v18:react",
        "//third_party/javascript/react_dom/v18:react_dom",
    ],
)

corp_run_image(
    name = "image",
    binary = ":server",
)

container_push(
    name = "push",
    format = "Docker",
    image = ":image",
    # The repository will be overridden by the user or in a follow-up step.
    repository = "us-central1-docker.pkg.dev/apigee-ux-standard-testing/cr-images/default-svc",
)
