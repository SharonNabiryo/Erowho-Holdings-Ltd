(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/react/cjs/react.development.js
  var require_react_development = __commonJS({
    "node_modules/react/cjs/react.development.js"(exports, module) {
      "use strict";
      (function() {
        function defineDeprecationWarning(methodName, info) {
          Object.defineProperty(Component.prototype, methodName, {
            get: function() {
              console.warn(
                "%s(...) is deprecated in plain JavaScript React classes. %s",
                info[0],
                info[1]
              );
            }
          });
        }
        function getIteratorFn(maybeIterable) {
          if (null === maybeIterable || "object" !== typeof maybeIterable)
            return null;
          maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
          return "function" === typeof maybeIterable ? maybeIterable : null;
        }
        function warnNoop(publicInstance, callerName) {
          publicInstance = (publicInstance = publicInstance.constructor) && (publicInstance.displayName || publicInstance.name) || "ReactClass";
          var warningKey = publicInstance + "." + callerName;
          didWarnStateUpdateForUnmountedComponent[warningKey] || (console.error(
            "Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.",
            callerName,
            publicInstance
          ), didWarnStateUpdateForUnmountedComponent[warningKey] = true);
        }
        function Component(props, context, updater) {
          this.props = props;
          this.context = context;
          this.refs = emptyObject;
          this.updater = updater || ReactNoopUpdateQueue;
        }
        function ComponentDummy() {
        }
        function PureComponent(props, context, updater) {
          this.props = props;
          this.context = context;
          this.refs = emptyObject;
          this.updater = updater || ReactNoopUpdateQueue;
        }
        function noop() {
        }
        function testStringCoercion(value) {
          return "" + value;
        }
        function checkKeyStringCoercion(value) {
          try {
            testStringCoercion(value);
            var JSCompiler_inline_result = false;
          } catch (e) {
            JSCompiler_inline_result = true;
          }
          if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(
              JSCompiler_inline_result,
              "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
              JSCompiler_inline_result$jscomp$0
            );
            return testStringCoercion(value);
          }
        }
        function getComponentNameFromType(type) {
          if (null == type) return null;
          if ("function" === typeof type)
            return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
          if ("string" === typeof type) return type;
          switch (type) {
            case REACT_FRAGMENT_TYPE:
              return "Fragment";
            case REACT_PROFILER_TYPE:
              return "Profiler";
            case REACT_STRICT_MODE_TYPE:
              return "StrictMode";
            case REACT_SUSPENSE_TYPE:
              return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
              return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
              return "Activity";
          }
          if ("object" === typeof type)
            switch ("number" === typeof type.tag && console.error(
              "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
            ), type.$$typeof) {
              case REACT_PORTAL_TYPE:
                return "Portal";
              case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
              case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
              case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
              case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
              case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                  return getComponentNameFromType(type(innerType));
                } catch (x) {
                }
            }
          return null;
        }
        function getTaskName(type) {
          if (type === REACT_FRAGMENT_TYPE) return "<>";
          if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE)
            return "<...>";
          try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
          } catch (x) {
            return "<...>";
          }
        }
        function getOwner() {
          var dispatcher = ReactSharedInternals.A;
          return null === dispatcher ? null : dispatcher.getOwner();
        }
        function UnknownOwner() {
          return Error("react-stack-top-frame");
        }
        function hasValidKey(config) {
          if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return false;
          }
          return void 0 !== config.key;
        }
        function defineKeyPropWarningGetter(props, displayName) {
          function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
              "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
              displayName
            ));
          }
          warnAboutAccessingKey.isReactWarning = true;
          Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: true
          });
        }
        function elementRefGetterWithDeprecationWarning() {
          var componentName = getComponentNameFromType(this.type);
          didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
            "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
          ));
          componentName = this.props.ref;
          return void 0 !== componentName ? componentName : null;
        }
        function ReactElement(type, key, props, owner, debugStack, debugTask) {
          var refProp = props.ref;
          type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type,
            key,
            props,
            _owner: owner
          };
          null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: false,
            get: elementRefGetterWithDeprecationWarning
          }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
          type._store = {};
          Object.defineProperty(type._store, "validated", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: 0
          });
          Object.defineProperty(type, "_debugInfo", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: null
          });
          Object.defineProperty(type, "_debugStack", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: debugStack
          });
          Object.defineProperty(type, "_debugTask", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: debugTask
          });
          Object.freeze && (Object.freeze(type.props), Object.freeze(type));
          return type;
        }
        function cloneAndReplaceKey(oldElement, newKey) {
          newKey = ReactElement(
            oldElement.type,
            newKey,
            oldElement.props,
            oldElement._owner,
            oldElement._debugStack,
            oldElement._debugTask
          );
          oldElement._store && (newKey._store.validated = oldElement._store.validated);
          return newKey;
        }
        function validateChildKeys(node) {
          isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
        }
        function isValidElement(object) {
          return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
        }
        function escape(key) {
          var escaperLookup = { "=": "=0", ":": "=2" };
          return "$" + key.replace(/[=:]/g, function(match) {
            return escaperLookup[match];
          });
        }
        function getElementKey(element, index) {
          return "object" === typeof element && null !== element && null != element.key ? (checkKeyStringCoercion(element.key), escape("" + element.key)) : index.toString(36);
        }
        function resolveThenable(thenable) {
          switch (thenable.status) {
            case "fulfilled":
              return thenable.value;
            case "rejected":
              throw thenable.reason;
            default:
              switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
                function(fulfilledValue) {
                  "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
                },
                function(error) {
                  "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
                }
              )), thenable.status) {
                case "fulfilled":
                  return thenable.value;
                case "rejected":
                  throw thenable.reason;
              }
          }
          throw thenable;
        }
        function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
          var type = typeof children;
          if ("undefined" === type || "boolean" === type) children = null;
          var invokeCallback = false;
          if (null === children) invokeCallback = true;
          else
            switch (type) {
              case "bigint":
              case "string":
              case "number":
                invokeCallback = true;
                break;
              case "object":
                switch (children.$$typeof) {
                  case REACT_ELEMENT_TYPE:
                  case REACT_PORTAL_TYPE:
                    invokeCallback = true;
                    break;
                  case REACT_LAZY_TYPE:
                    return invokeCallback = children._init, mapIntoArray(
                      invokeCallback(children._payload),
                      array,
                      escapedPrefix,
                      nameSoFar,
                      callback
                    );
                }
            }
          if (invokeCallback) {
            invokeCallback = children;
            callback = callback(invokeCallback);
            var childKey = "" === nameSoFar ? "." + getElementKey(invokeCallback, 0) : nameSoFar;
            isArrayImpl(callback) ? (escapedPrefix = "", null != childKey && (escapedPrefix = childKey.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
              return c;
            })) : null != callback && (isValidElement(callback) && (null != callback.key && (invokeCallback && invokeCallback.key === callback.key || checkKeyStringCoercion(callback.key)), escapedPrefix = cloneAndReplaceKey(
              callback,
              escapedPrefix + (null == callback.key || invokeCallback && invokeCallback.key === callback.key ? "" : ("" + callback.key).replace(
                userProvidedKeyEscapeRegex,
                "$&/"
              ) + "/") + childKey
            ), "" !== nameSoFar && null != invokeCallback && isValidElement(invokeCallback) && null == invokeCallback.key && invokeCallback._store && !invokeCallback._store.validated && (escapedPrefix._store.validated = 2), callback = escapedPrefix), array.push(callback));
            return 1;
          }
          invokeCallback = 0;
          childKey = "" === nameSoFar ? "." : nameSoFar + ":";
          if (isArrayImpl(children))
            for (var i = 0; i < children.length; i++)
              nameSoFar = children[i], type = childKey + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
                nameSoFar,
                array,
                escapedPrefix,
                type,
                callback
              );
          else if (i = getIteratorFn(children), "function" === typeof i)
            for (i === children.entries && (didWarnAboutMaps || console.warn(
              "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
            ), didWarnAboutMaps = true), children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
              nameSoFar = nameSoFar.value, type = childKey + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
                nameSoFar,
                array,
                escapedPrefix,
                type,
                callback
              );
          else if ("object" === type) {
            if ("function" === typeof children.then)
              return mapIntoArray(
                resolveThenable(children),
                array,
                escapedPrefix,
                nameSoFar,
                callback
              );
            array = String(children);
            throw Error(
              "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
            );
          }
          return invokeCallback;
        }
        function mapChildren(children, func, context) {
          if (null == children) return children;
          var result = [], count = 0;
          mapIntoArray(children, result, "", "", function(child) {
            return func.call(context, child, count++);
          });
          return result;
        }
        function lazyInitializer(payload) {
          if (-1 === payload._status) {
            var ioInfo = payload._ioInfo;
            null != ioInfo && (ioInfo.start = ioInfo.end = performance.now());
            ioInfo = payload._result;
            var thenable = ioInfo();
            thenable.then(
              function(moduleObject) {
                if (0 === payload._status || -1 === payload._status) {
                  payload._status = 1;
                  payload._result = moduleObject;
                  var _ioInfo = payload._ioInfo;
                  null != _ioInfo && (_ioInfo.end = performance.now());
                  void 0 === thenable.status && (thenable.status = "fulfilled", thenable.value = moduleObject);
                }
              },
              function(error) {
                if (0 === payload._status || -1 === payload._status) {
                  payload._status = 2;
                  payload._result = error;
                  var _ioInfo2 = payload._ioInfo;
                  null != _ioInfo2 && (_ioInfo2.end = performance.now());
                  void 0 === thenable.status && (thenable.status = "rejected", thenable.reason = error);
                }
              }
            );
            ioInfo = payload._ioInfo;
            if (null != ioInfo) {
              ioInfo.value = thenable;
              var displayName = thenable.displayName;
              "string" === typeof displayName && (ioInfo.name = displayName);
            }
            -1 === payload._status && (payload._status = 0, payload._result = thenable);
          }
          if (1 === payload._status)
            return ioInfo = payload._result, void 0 === ioInfo && console.error(
              "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?",
              ioInfo
            ), "default" in ioInfo || console.error(
              "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))",
              ioInfo
            ), ioInfo.default;
          throw payload._result;
        }
        function resolveDispatcher() {
          var dispatcher = ReactSharedInternals.H;
          null === dispatcher && console.error(
            "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
          );
          return dispatcher;
        }
        function releaseAsyncTransition() {
          ReactSharedInternals.asyncTransitions--;
        }
        function enqueueTask(task) {
          if (null === enqueueTaskImpl)
            try {
              var requireString = ("require" + Math.random()).slice(0, 7);
              enqueueTaskImpl = (module && module[requireString]).call(
                module,
                "timers"
              ).setImmediate;
            } catch (_err) {
              enqueueTaskImpl = function(callback) {
                false === didWarnAboutMessageChannel && (didWarnAboutMessageChannel = true, "undefined" === typeof MessageChannel && console.error(
                  "This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."
                ));
                var channel = new MessageChannel();
                channel.port1.onmessage = callback;
                channel.port2.postMessage(void 0);
              };
            }
          return enqueueTaskImpl(task);
        }
        function aggregateErrors(errors) {
          return 1 < errors.length && "function" === typeof AggregateError ? new AggregateError(errors) : errors[0];
        }
        function popActScope(prevActQueue, prevActScopeDepth) {
          prevActScopeDepth !== actScopeDepth - 1 && console.error(
            "You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "
          );
          actScopeDepth = prevActScopeDepth;
        }
        function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
          var queue = ReactSharedInternals.actQueue;
          if (null !== queue)
            if (0 !== queue.length)
              try {
                flushActQueue(queue);
                enqueueTask(function() {
                  return recursivelyFlushAsyncActWork(returnValue, resolve, reject);
                });
                return;
              } catch (error) {
                ReactSharedInternals.thrownErrors.push(error);
              }
            else ReactSharedInternals.actQueue = null;
          0 < ReactSharedInternals.thrownErrors.length ? (queue = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, reject(queue)) : resolve(returnValue);
        }
        function flushActQueue(queue) {
          if (!isFlushing) {
            isFlushing = true;
            var i = 0;
            try {
              for (; i < queue.length; i++) {
                var callback = queue[i];
                do {
                  ReactSharedInternals.didUsePromise = false;
                  var continuation = callback(false);
                  if (null !== continuation) {
                    if (ReactSharedInternals.didUsePromise) {
                      queue[i] = callback;
                      queue.splice(0, i);
                      return;
                    }
                    callback = continuation;
                  } else break;
                } while (1);
              }
              queue.length = 0;
            } catch (error) {
              queue.splice(0, i + 1), ReactSharedInternals.thrownErrors.push(error);
            } finally {
              isFlushing = false;
            }
          }
        }
        "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
        var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator, didWarnStateUpdateForUnmountedComponent = {}, ReactNoopUpdateQueue = {
          isMounted: function() {
            return false;
          },
          enqueueForceUpdate: function(publicInstance) {
            warnNoop(publicInstance, "forceUpdate");
          },
          enqueueReplaceState: function(publicInstance) {
            warnNoop(publicInstance, "replaceState");
          },
          enqueueSetState: function(publicInstance) {
            warnNoop(publicInstance, "setState");
          }
        }, assign = Object.assign, emptyObject = {};
        Object.freeze(emptyObject);
        Component.prototype.isReactComponent = {};
        Component.prototype.setState = function(partialState, callback) {
          if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
            throw Error(
              "takes an object of state variables to update or a function which returns an object of state variables."
            );
          this.updater.enqueueSetState(this, partialState, callback, "setState");
        };
        Component.prototype.forceUpdate = function(callback) {
          this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
        };
        var deprecatedAPIs = {
          isMounted: [
            "isMounted",
            "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."
          ],
          replaceState: [
            "replaceState",
            "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."
          ]
        };
        for (fnName in deprecatedAPIs)
          deprecatedAPIs.hasOwnProperty(fnName) && defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
        ComponentDummy.prototype = Component.prototype;
        deprecatedAPIs = PureComponent.prototype = new ComponentDummy();
        deprecatedAPIs.constructor = PureComponent;
        assign(deprecatedAPIs, Component.prototype);
        deprecatedAPIs.isPureReactComponent = true;
        var isArrayImpl = Array.isArray, REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference"), ReactSharedInternals = {
          H: null,
          A: null,
          T: null,
          S: null,
          actQueue: null,
          asyncTransitions: 0,
          isBatchingLegacy: false,
          didScheduleLegacyUpdate: false,
          didUsePromise: false,
          thrownErrors: [],
          getCurrentStack: null,
          recentlyCreatedOwnerStacks: 0
        }, hasOwnProperty = Object.prototype.hasOwnProperty, createTask = console.createTask ? console.createTask : function() {
          return null;
        };
        deprecatedAPIs = {
          react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
          }
        };
        var specialPropKeyWarningShown, didWarnAboutOldJSXRuntime;
        var didWarnAboutElementRef = {};
        var unknownOwnerDebugStack = deprecatedAPIs.react_stack_bottom_frame.bind(
          deprecatedAPIs,
          UnknownOwner
        )();
        var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
        var didWarnAboutMaps = false, userProvidedKeyEscapeRegex = /\/+/g, reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
          if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
            var event = new window.ErrorEvent("error", {
              bubbles: true,
              cancelable: true,
              message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
              error
            });
            if (!window.dispatchEvent(event)) return;
          } else if ("object" === typeof process && "function" === typeof process.emit) {
            process.emit("uncaughtException", error);
            return;
          }
          console.error(error);
        }, didWarnAboutMessageChannel = false, enqueueTaskImpl = null, actScopeDepth = 0, didWarnNoAwaitAct = false, isFlushing = false, queueSeveralMicrotasks = "function" === typeof queueMicrotask ? function(callback) {
          queueMicrotask(function() {
            return queueMicrotask(callback);
          });
        } : enqueueTask;
        deprecatedAPIs = Object.freeze({
          __proto__: null,
          c: function(size) {
            return resolveDispatcher().useMemoCache(size);
          }
        });
        var fnName = {
          map: mapChildren,
          forEach: function(children, forEachFunc, forEachContext) {
            mapChildren(
              children,
              function() {
                forEachFunc.apply(this, arguments);
              },
              forEachContext
            );
          },
          count: function(children) {
            var n = 0;
            mapChildren(children, function() {
              n++;
            });
            return n;
          },
          toArray: function(children) {
            return mapChildren(children, function(child) {
              return child;
            }) || [];
          },
          only: function(children) {
            if (!isValidElement(children))
              throw Error(
                "React.Children.only expected to receive a single React element child."
              );
            return children;
          }
        };
        exports.Activity = REACT_ACTIVITY_TYPE;
        exports.Children = fnName;
        exports.Component = Component;
        exports.Fragment = REACT_FRAGMENT_TYPE;
        exports.Profiler = REACT_PROFILER_TYPE;
        exports.PureComponent = PureComponent;
        exports.StrictMode = REACT_STRICT_MODE_TYPE;
        exports.Suspense = REACT_SUSPENSE_TYPE;
        exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
        exports.__COMPILER_RUNTIME = deprecatedAPIs;
        exports.act = function(callback) {
          var prevActQueue = ReactSharedInternals.actQueue, prevActScopeDepth = actScopeDepth;
          actScopeDepth++;
          var queue = ReactSharedInternals.actQueue = null !== prevActQueue ? prevActQueue : [], didAwaitActCall = false;
          try {
            var result = callback();
          } catch (error) {
            ReactSharedInternals.thrownErrors.push(error);
          }
          if (0 < ReactSharedInternals.thrownErrors.length)
            throw popActScope(prevActQueue, prevActScopeDepth), callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
          if (null !== result && "object" === typeof result && "function" === typeof result.then) {
            var thenable = result;
            queueSeveralMicrotasks(function() {
              didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
                "You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"
              ));
            });
            return {
              then: function(resolve, reject) {
                didAwaitActCall = true;
                thenable.then(
                  function(returnValue) {
                    popActScope(prevActQueue, prevActScopeDepth);
                    if (0 === prevActScopeDepth) {
                      try {
                        flushActQueue(queue), enqueueTask(function() {
                          return recursivelyFlushAsyncActWork(
                            returnValue,
                            resolve,
                            reject
                          );
                        });
                      } catch (error$0) {
                        ReactSharedInternals.thrownErrors.push(error$0);
                      }
                      if (0 < ReactSharedInternals.thrownErrors.length) {
                        var _thrownError = aggregateErrors(
                          ReactSharedInternals.thrownErrors
                        );
                        ReactSharedInternals.thrownErrors.length = 0;
                        reject(_thrownError);
                      }
                    } else resolve(returnValue);
                  },
                  function(error) {
                    popActScope(prevActQueue, prevActScopeDepth);
                    0 < ReactSharedInternals.thrownErrors.length ? (error = aggregateErrors(
                      ReactSharedInternals.thrownErrors
                    ), ReactSharedInternals.thrownErrors.length = 0, reject(error)) : reject(error);
                  }
                );
              }
            };
          }
          var returnValue$jscomp$0 = result;
          popActScope(prevActQueue, prevActScopeDepth);
          0 === prevActScopeDepth && (flushActQueue(queue), 0 !== queue.length && queueSeveralMicrotasks(function() {
            didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
              "A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"
            ));
          }), ReactSharedInternals.actQueue = null);
          if (0 < ReactSharedInternals.thrownErrors.length)
            throw callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
          return {
            then: function(resolve, reject) {
              didAwaitActCall = true;
              0 === prevActScopeDepth ? (ReactSharedInternals.actQueue = queue, enqueueTask(function() {
                return recursivelyFlushAsyncActWork(
                  returnValue$jscomp$0,
                  resolve,
                  reject
                );
              })) : resolve(returnValue$jscomp$0);
            }
          };
        };
        exports.cache = function(fn) {
          return function() {
            return fn.apply(null, arguments);
          };
        };
        exports.cacheSignal = function() {
          return null;
        };
        exports.captureOwnerStack = function() {
          var getCurrentStack = ReactSharedInternals.getCurrentStack;
          return null === getCurrentStack ? null : getCurrentStack();
        };
        exports.cloneElement = function(element, config, children) {
          if (null === element || void 0 === element)
            throw Error(
              "The argument must be a React element, but you passed " + element + "."
            );
          var props = assign({}, element.props), key = element.key, owner = element._owner;
          if (null != config) {
            var JSCompiler_inline_result;
            a: {
              if (hasOwnProperty.call(config, "ref") && (JSCompiler_inline_result = Object.getOwnPropertyDescriptor(
                config,
                "ref"
              ).get) && JSCompiler_inline_result.isReactWarning) {
                JSCompiler_inline_result = false;
                break a;
              }
              JSCompiler_inline_result = void 0 !== config.ref;
            }
            JSCompiler_inline_result && (owner = getOwner());
            hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key);
            for (propName in config)
              !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
          }
          var propName = arguments.length - 2;
          if (1 === propName) props.children = children;
          else if (1 < propName) {
            JSCompiler_inline_result = Array(propName);
            for (var i = 0; i < propName; i++)
              JSCompiler_inline_result[i] = arguments[i + 2];
            props.children = JSCompiler_inline_result;
          }
          props = ReactElement(
            element.type,
            key,
            props,
            owner,
            element._debugStack,
            element._debugTask
          );
          for (key = 2; key < arguments.length; key++)
            validateChildKeys(arguments[key]);
          return props;
        };
        exports.createContext = function(defaultValue) {
          defaultValue = {
            $$typeof: REACT_CONTEXT_TYPE,
            _currentValue: defaultValue,
            _currentValue2: defaultValue,
            _threadCount: 0,
            Provider: null,
            Consumer: null
          };
          defaultValue.Provider = defaultValue;
          defaultValue.Consumer = {
            $$typeof: REACT_CONSUMER_TYPE,
            _context: defaultValue
          };
          defaultValue._currentRenderer = null;
          defaultValue._currentRenderer2 = null;
          return defaultValue;
        };
        exports.createElement = function(type, config, children) {
          for (var i = 2; i < arguments.length; i++)
            validateChildKeys(arguments[i]);
          i = {};
          var key = null;
          if (null != config)
            for (propName in didWarnAboutOldJSXRuntime || !("__self" in config) || "key" in config || (didWarnAboutOldJSXRuntime = true, console.warn(
              "Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform"
            )), hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key), config)
              hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (i[propName] = config[propName]);
          var childrenLength = arguments.length - 2;
          if (1 === childrenLength) i.children = children;
          else if (1 < childrenLength) {
            for (var childArray = Array(childrenLength), _i = 0; _i < childrenLength; _i++)
              childArray[_i] = arguments[_i + 2];
            Object.freeze && Object.freeze(childArray);
            i.children = childArray;
          }
          if (type && type.defaultProps)
            for (propName in childrenLength = type.defaultProps, childrenLength)
              void 0 === i[propName] && (i[propName] = childrenLength[propName]);
          key && defineKeyPropWarningGetter(
            i,
            "function" === typeof type ? type.displayName || type.name || "Unknown" : type
          );
          var propName = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
          return ReactElement(
            type,
            key,
            i,
            getOwner(),
            propName ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
            propName ? createTask(getTaskName(type)) : unknownOwnerDebugTask
          );
        };
        exports.createRef = function() {
          var refObject = { current: null };
          Object.seal(refObject);
          return refObject;
        };
        exports.forwardRef = function(render) {
          null != render && render.$$typeof === REACT_MEMO_TYPE ? console.error(
            "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))."
          ) : "function" !== typeof render ? console.error(
            "forwardRef requires a render function but was given %s.",
            null === render ? "null" : typeof render
          ) : 0 !== render.length && 2 !== render.length && console.error(
            "forwardRef render functions accept exactly two parameters: props and ref. %s",
            1 === render.length ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."
          );
          null != render && null != render.defaultProps && console.error(
            "forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?"
          );
          var elementType = { $$typeof: REACT_FORWARD_REF_TYPE, render }, ownName;
          Object.defineProperty(elementType, "displayName", {
            enumerable: false,
            configurable: true,
            get: function() {
              return ownName;
            },
            set: function(name) {
              ownName = name;
              render.name || render.displayName || (Object.defineProperty(render, "name", { value: name }), render.displayName = name);
            }
          });
          return elementType;
        };
        exports.isValidElement = isValidElement;
        exports.lazy = function(ctor) {
          ctor = { _status: -1, _result: ctor };
          var lazyType = {
            $$typeof: REACT_LAZY_TYPE,
            _payload: ctor,
            _init: lazyInitializer
          }, ioInfo = {
            name: "lazy",
            start: -1,
            end: -1,
            value: null,
            owner: null,
            debugStack: Error("react-stack-top-frame"),
            debugTask: console.createTask ? console.createTask("lazy()") : null
          };
          ctor._ioInfo = ioInfo;
          lazyType._debugInfo = [{ awaited: ioInfo }];
          return lazyType;
        };
        exports.memo = function(type, compare) {
          null == type && console.error(
            "memo: The first argument must be a component. Instead received: %s",
            null === type ? "null" : typeof type
          );
          compare = {
            $$typeof: REACT_MEMO_TYPE,
            type,
            compare: void 0 === compare ? null : compare
          };
          var ownName;
          Object.defineProperty(compare, "displayName", {
            enumerable: false,
            configurable: true,
            get: function() {
              return ownName;
            },
            set: function(name) {
              ownName = name;
              type.name || type.displayName || (Object.defineProperty(type, "name", { value: name }), type.displayName = name);
            }
          });
          return compare;
        };
        exports.startTransition = function(scope) {
          var prevTransition = ReactSharedInternals.T, currentTransition = {};
          currentTransition._updatedFibers = /* @__PURE__ */ new Set();
          ReactSharedInternals.T = currentTransition;
          try {
            var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
            null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
            "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && (ReactSharedInternals.asyncTransitions++, returnValue.then(releaseAsyncTransition, releaseAsyncTransition), returnValue.then(noop, reportGlobalError));
          } catch (error) {
            reportGlobalError(error);
          } finally {
            null === prevTransition && currentTransition._updatedFibers && (scope = currentTransition._updatedFibers.size, currentTransition._updatedFibers.clear(), 10 < scope && console.warn(
              "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
            )), null !== prevTransition && null !== currentTransition.types && (null !== prevTransition.types && prevTransition.types !== currentTransition.types && console.error(
              "We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."
            ), prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
          }
        };
        exports.unstable_useCacheRefresh = function() {
          return resolveDispatcher().useCacheRefresh();
        };
        exports.use = function(usable) {
          return resolveDispatcher().use(usable);
        };
        exports.useActionState = function(action, initialState, permalink) {
          return resolveDispatcher().useActionState(
            action,
            initialState,
            permalink
          );
        };
        exports.useCallback = function(callback, deps) {
          return resolveDispatcher().useCallback(callback, deps);
        };
        exports.useContext = function(Context) {
          var dispatcher = resolveDispatcher();
          Context.$$typeof === REACT_CONSUMER_TYPE && console.error(
            "Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"
          );
          return dispatcher.useContext(Context);
        };
        exports.useDebugValue = function(value, formatterFn) {
          return resolveDispatcher().useDebugValue(value, formatterFn);
        };
        exports.useDeferredValue = function(value, initialValue) {
          return resolveDispatcher().useDeferredValue(value, initialValue);
        };
        exports.useEffect = function(create, deps) {
          null == create && console.warn(
            "React Hook useEffect requires an effect callback. Did you forget to pass a callback to the hook?"
          );
          return resolveDispatcher().useEffect(create, deps);
        };
        exports.useEffectEvent = function(callback) {
          return resolveDispatcher().useEffectEvent(callback);
        };
        exports.useId = function() {
          return resolveDispatcher().useId();
        };
        exports.useImperativeHandle = function(ref, create, deps) {
          return resolveDispatcher().useImperativeHandle(ref, create, deps);
        };
        exports.useInsertionEffect = function(create, deps) {
          null == create && console.warn(
            "React Hook useInsertionEffect requires an effect callback. Did you forget to pass a callback to the hook?"
          );
          return resolveDispatcher().useInsertionEffect(create, deps);
        };
        exports.useLayoutEffect = function(create, deps) {
          null == create && console.warn(
            "React Hook useLayoutEffect requires an effect callback. Did you forget to pass a callback to the hook?"
          );
          return resolveDispatcher().useLayoutEffect(create, deps);
        };
        exports.useMemo = function(create, deps) {
          return resolveDispatcher().useMemo(create, deps);
        };
        exports.useOptimistic = function(passthrough, reducer) {
          return resolveDispatcher().useOptimistic(passthrough, reducer);
        };
        exports.useReducer = function(reducer, initialArg, init) {
          return resolveDispatcher().useReducer(reducer, initialArg, init);
        };
        exports.useRef = function(initialValue) {
          return resolveDispatcher().useRef(initialValue);
        };
        exports.useState = function(initialState) {
          return resolveDispatcher().useState(initialState);
        };
        exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
          return resolveDispatcher().useSyncExternalStore(
            subscribe,
            getSnapshot,
            getServerSnapshot
          );
        };
        exports.useTransition = function() {
          return resolveDispatcher().useTransition();
        };
        exports.version = "19.2.7";
        "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
      })();
    }
  });

  // node_modules/react/index.js
  var require_react = __commonJS({
    "node_modules/react/index.js"(exports, module) {
      "use strict";
      if (false) {
        module.exports = null;
      } else {
        module.exports = require_react_development();
      }
    }
  });

  // node_modules/react/cjs/react-jsx-runtime.development.js
  var require_react_jsx_runtime_development = __commonJS({
    "node_modules/react/cjs/react-jsx-runtime.development.js"(exports) {
      "use strict";
      (function() {
        function getComponentNameFromType(type) {
          if (null == type) return null;
          if ("function" === typeof type)
            return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
          if ("string" === typeof type) return type;
          switch (type) {
            case REACT_FRAGMENT_TYPE:
              return "Fragment";
            case REACT_PROFILER_TYPE:
              return "Profiler";
            case REACT_STRICT_MODE_TYPE:
              return "StrictMode";
            case REACT_SUSPENSE_TYPE:
              return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
              return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
              return "Activity";
          }
          if ("object" === typeof type)
            switch ("number" === typeof type.tag && console.error(
              "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
            ), type.$$typeof) {
              case REACT_PORTAL_TYPE:
                return "Portal";
              case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
              case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
              case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
              case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
              case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                  return getComponentNameFromType(type(innerType));
                } catch (x) {
                }
            }
          return null;
        }
        function testStringCoercion(value) {
          return "" + value;
        }
        function checkKeyStringCoercion(value) {
          try {
            testStringCoercion(value);
            var JSCompiler_inline_result = false;
          } catch (e) {
            JSCompiler_inline_result = true;
          }
          if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(
              JSCompiler_inline_result,
              "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
              JSCompiler_inline_result$jscomp$0
            );
            return testStringCoercion(value);
          }
        }
        function getTaskName(type) {
          if (type === REACT_FRAGMENT_TYPE) return "<>";
          if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE)
            return "<...>";
          try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
          } catch (x) {
            return "<...>";
          }
        }
        function getOwner() {
          var dispatcher = ReactSharedInternals.A;
          return null === dispatcher ? null : dispatcher.getOwner();
        }
        function UnknownOwner() {
          return Error("react-stack-top-frame");
        }
        function hasValidKey(config) {
          if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return false;
          }
          return void 0 !== config.key;
        }
        function defineKeyPropWarningGetter(props, displayName) {
          function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
              "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
              displayName
            ));
          }
          warnAboutAccessingKey.isReactWarning = true;
          Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: true
          });
        }
        function elementRefGetterWithDeprecationWarning() {
          var componentName = getComponentNameFromType(this.type);
          didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
            "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
          ));
          componentName = this.props.ref;
          return void 0 !== componentName ? componentName : null;
        }
        function ReactElement(type, key, props, owner, debugStack, debugTask) {
          var refProp = props.ref;
          type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type,
            key,
            props,
            _owner: owner
          };
          null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: false,
            get: elementRefGetterWithDeprecationWarning
          }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
          type._store = {};
          Object.defineProperty(type._store, "validated", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: 0
          });
          Object.defineProperty(type, "_debugInfo", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: null
          });
          Object.defineProperty(type, "_debugStack", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: debugStack
          });
          Object.defineProperty(type, "_debugTask", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: debugTask
          });
          Object.freeze && (Object.freeze(type.props), Object.freeze(type));
          return type;
        }
        function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
          var children = config.children;
          if (void 0 !== children)
            if (isStaticChildren)
              if (isArrayImpl(children)) {
                for (isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)
                  validateChildKeys(children[isStaticChildren]);
                Object.freeze && Object.freeze(children);
              } else
                console.error(
                  "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
                );
            else validateChildKeys(children);
          if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
              return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error(
              'A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />',
              isStaticChildren,
              children,
              keys,
              children
            ), didWarnAboutKeySpread[children + isStaticChildren] = true);
          }
          children = null;
          void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
          hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
          if ("key" in config) {
            maybeKey = {};
            for (var propName in config)
              "key" !== propName && (maybeKey[propName] = config[propName]);
          } else maybeKey = config;
          children && defineKeyPropWarningGetter(
            maybeKey,
            "function" === typeof type ? type.displayName || type.name || "Unknown" : type
          );
          return ReactElement(
            type,
            children,
            maybeKey,
            getOwner(),
            debugStack,
            debugTask
          );
        }
        function validateChildKeys(node) {
          isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
        }
        function isValidElement(object) {
          return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
        }
        var React6 = require_react(), REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity"), REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference"), ReactSharedInternals = React6.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
          return null;
        };
        React6 = {
          react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
          }
        };
        var specialPropKeyWarningShown;
        var didWarnAboutElementRef = {};
        var unknownOwnerDebugStack = React6.react_stack_bottom_frame.bind(
          React6,
          UnknownOwner
        )();
        var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
        var didWarnAboutKeySpread = {};
        exports.Fragment = REACT_FRAGMENT_TYPE;
        exports.jsx = function(type, config, maybeKey) {
          var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
          return jsxDEVImpl(
            type,
            config,
            maybeKey,
            false,
            trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
            trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask
          );
        };
        exports.jsxs = function(type, config, maybeKey) {
          var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
          return jsxDEVImpl(
            type,
            config,
            maybeKey,
            true,
            trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
            trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask
          );
        };
      })();
    }
  });

  // node_modules/react/jsx-runtime.js
  var require_jsx_runtime = __commonJS({
    "node_modules/react/jsx-runtime.js"(exports, module) {
      "use strict";
      if (false) {
        module.exports = null;
      } else {
        module.exports = require_react_jsx_runtime_development();
      }
    }
  });

  // src/App.tsx
  var import_react5 = __toESM(require_react());

  // src/tokens.ts
  var C = {
    // Light backgrounds (main public site)
    ivory: "#F7F1E8",
    // Warm Ivory — main background
    sand: "#E8D8C3",
    // Soft Sand — section breaks
    cream: "#FAF6F0",
    // Cream — light card surfaces
    stone: "#D7C7B5",
    // Stone Beige — borders, dividers
    // Dark surfaces (dark sections, footer, admin)
    espresso: "#2A211B",
    // Deep Espresso — text, footer, dark overlays
    charcoal: "#3A3028",
    // Charcoal Brown — dark hero sections
    darkCard: "#4A3E34",
    // slightly lighter dark card surface
    darkBorder: "#5A4E44",
    // dark section borders
    // Accent colors
    gold: "#C8A86B",
    // Champagne Gold — buttons, premium highlights
    clay: "#B89B7B",
    // Clay Taupe — warmth, secondary accents
    terracotta: "#B66E4F",
    // Muted Terracotta — selective highlights, CTAs
    olive: "#6F7564",
    // Olive Gray — secondary text
    // Text
    text: "#2A211B",
    // Deep Espresso — body text on light bg
    muted: "#7A6A5C",
    // warm muted text
    subtle: "#A09080",
    // subtle/placeholder text
    // Legacy aliases (keeps older references working)
    graphite: "#2A211B",
    charcoalOld: "#3A3028",
    brass: "#C8A86B",
    champagne: "#E8D8C3",
    taupe: "#B89B7B",
    slate: "#6F7564",
    bronze: "#B66E4F",
    bodyDark: "#7A6A5C",
    lBg: "#F7F1E8",
    lSurface: "#FAF6F0",
    lCard: "#FFFFFF",
    lBorder: "#D7C7B5",
    lText: "#2A211B",
    lMuted: "#7A6A5C",
    lSubtle: "#A09080"
  };
  var F = {
    serif: "'Cormorant Garamond', Georgia, serif",
    sans: "'DM Sans', system-ui, sans-serif",
    mono: "'DM Mono', monospace"
  };
  var STATUS_STYLE = {
    "Available": { bg: "#EBF4E8", text: "#3A7A37", border: "#B8D4B5" },
    "Coming Soon": { bg: "#FBF5E8", text: "#8A6A2A", border: "#E0D0A0" },
    "Rented": { bg: "#F2EDE8", text: "#8C6A4A", border: "#D4C0A8" },
    "Under Review": { bg: "#EEF2F6", text: "#5A7A9A", border: "#B8CCDC" }
  };
  var PROPERTY_IMAGES = {
    "Townhome": "https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=800&q=80",
    "Single-Family Home": "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
    "Duplex": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    "Apartment": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    "Condo": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    "Multifamily": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    "default": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
  };
  var HERO_IMAGE = "https://images.unsplash.com/photo-1730629651658-c730ddd1c6b9?auto=format&fit=crop&w=1920&q=85";
  var GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #F7F1E8; color: #2A211B; font-family: 'DM Sans', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
  input, select, textarea, button { font-family: 'DM Sans', system-ui, sans-serif; }

  /* \u2500\u2500 Buttons \u2500\u2500 */
  .btn-primary {
    background: #C8A86B; color: #2A211B; border: none; cursor: pointer;
    font-weight: 500; font-size: 14px; letter-spacing: 0.02em;
    transition: background 0.2s, transform 0.12s, box-shadow 0.2s;
    border-radius: 8px;
  }
  .btn-primary:hover { background: #B89B7B; box-shadow: 0 4px 16px rgba(200,168,107,0.3); }
  .btn-primary:active { transform: scale(0.98); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  /* keep old class names working */
  .btn-brass { background: #C8A86B; color: #2A211B; border: none; cursor: pointer; font-weight: 500; transition: background 0.2s, transform 0.12s; border-radius: 8px; }
  .btn-brass:hover { background: #B89B7B; }
  .btn-brass:active { transform: scale(0.98); }
  .btn-brass:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-outline {
    background: transparent; border: 1.5px solid #D7C7B5; color: #2A211B; cursor: pointer;
    font-size: 14px; transition: border-color 0.2s, background 0.2s; border-radius: 8px;
  }
  .btn-outline:hover { border-color: #C8A86B; background: rgba(200,168,107,0.06); }

  .btn-outline-dark {
    background: transparent; border: 1.5px solid rgba(215,199,181,0.3); color: #FAF6F0; cursor: pointer;
    font-size: 14px; transition: border-color 0.2s, background 0.2s; border-radius: 8px;
  }
  .btn-outline-dark:hover { border-color: #C8A86B; color: #C8A86B; }

  .btn-light { background: transparent; border: 1px solid #D7C7B5; color: #2A211B; cursor: pointer; transition: border-color 0.2s; border-radius: 8px; }
  .btn-light:hover { border-color: #C8A86B; }

  .btn-danger { background: transparent; border: 1px solid #d4a8a0; color: #c07070; cursor: pointer; transition: background 0.2s; border-radius: 6px; }
  .btn-danger:hover { background: rgba(180,80,80,0.08); }

  /* \u2500\u2500 Inputs \u2500\u2500 */
  .inp {
    background: #fff; border: 1.5px solid #D7C7B5; color: #2A211B;
    padding: 10px 14px; border-radius: 8px; font-size: 14px; width: 100%;
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  }
  .inp:focus { border-color: #C8A86B; box-shadow: 0 0 0 3px rgba(200,168,107,0.15); }
  .inp::placeholder { color: #A09080; }

  .inp-dark { background: #4A3E34; border: 1.5px solid #5A4E44; color: #FAF6F0; }
  .inp-dark:focus { border-color: #C8A86B; }
  .inp-dark::placeholder { color: #8A7A6A; }

  /* \u2500\u2500 Property Card \u2500\u2500 */
  .pcard {
    background: #fff; border: 1px solid #D7C7B5; border-radius: 14px;
    overflow: hidden; cursor: pointer;
    transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
  }
  .pcard:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(42,33,27,0.14); border-color: #C8A86B; }
  .pcard:hover .pcard-img img { transform: scale(1.05); }
  .pcard-img img { transition: transform 0.5s ease; }

  /* \u2500\u2500 Nav \u2500\u2500 */
  .nav-lnk { background: none; border: none; cursor: pointer; transition: color 0.18s; padding: 4px 0; font-size: 13.5px; }

  /* \u2500\u2500 Admin table row \u2500\u2500 */
  tr.arow:hover td { background: rgba(200,168,107,0.05); }

  /* \u2500\u2500 Animations \u2500\u2500 */
  .fade-in { animation: fadeIn 0.35s ease both; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

  .spinner { width: 20px; height: 20px; border: 2px solid rgba(200,168,107,0.3); border-top-color: #C8A86B; border-radius: 50%; animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* \u2500\u2500 Glass card \u2500\u2500 */
  .glass-card {
    background: rgba(250,246,240,0.92);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(215,199,181,0.6);
    border-radius: 14px;
  }

  /* \u2500\u2500 Section label \u2500\u2500 */
  .section-label {
    font-size: 10px; letter-spacing: 0.22em; font-weight: 500; text-transform: uppercase;
  }

  /* \u2500\u2500 Responsive: Navbar \u2500\u2500 */
  .nav-desktop  { display: flex; align-items: center; gap: 30px; }
  .nav-hamburger { display: none; background: none; border: none; cursor: pointer; padding: 8px 4px; line-height: 1; }
  @media (max-width: 860px) {
    .nav-desktop  { display: none !important; }
    .nav-hamburger { display: flex !important; align-items: center; justify-content: center; }
  }

  /* \u2500\u2500 Responsive: Hero search grid \u2500\u2500 */
  .hero-search-grid { display: grid; grid-template-columns: 1.6fr 1fr 1fr auto; gap: 10px; }
  @media (max-width: 640px) {
    .hero-search-grid { grid-template-columns: 1fr !important; }
  }

  /* \u2500\u2500 Responsive: Hero content padding \u2500\u2500 */
  .hero-content { padding: 140px 28px 100px; width: 100%; max-width: 1240px; margin: 0 auto; }
  @media (max-width: 640px) {
    .hero-content { padding: 110px 20px 80px !important; }
  }

  /* \u2500\u2500 Responsive: Footer \u2500\u2500 */
  .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 54px; margin-bottom: 44px; padding-bottom: 40px; border-bottom: 1px solid rgba(215,199,181,0.12); }
  @media (max-width: 768px) {
    .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
  }

  /* \u2500\u2500 Responsive: Property card grid \u2500\u2500 */
  .prop-grid { display: grid; gap: 26px; }
  @media (max-width: 640px) {
    .prop-grid { grid-template-columns: 1fr !important; }
  }
`;

  // src/api.ts
  var import_meta = {};
  function resolveBase() {
    const envBase = import_meta?.env?.VITE_API_BASE_URL;
    if (typeof envBase === "string" && envBase.trim()) return envBase.trim();
    const w = window;
    if (typeof w.API_BASE === "string") return w.API_BASE;
    const h = window.location.hostname;
    if (h === "localhost" || h === "127.0.0.1") return "http://localhost:5001";
    return "";
  }
  var BASE = resolveBase();
  function getToken() {
    return localStorage.getItem("erowho_token");
  }
  async function request(method, path, body, auth = false) {
    const headers = { "Content-Type": "application/json" };
    if (auth) {
      const token = getToken();
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body !== void 0 ? JSON.stringify(body) : void 0
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || data.message || `Request failed (${res.status})`);
    }
    return data;
  }
  var get = (path, auth = false) => request("GET", path, void 0, auth);
  var post = (path, body, auth = false) => request("POST", path, body, auth);
  var put = (path, body) => request("PUT", path, body, true);
  var del = (path) => request("DELETE", path, void 0, true);
  var patch = (path, body) => request("PATCH", path, body, true);
  var api = {
    auth: {
      login: (username, password) => post("/api/auth/login", { username, password }),
      verify: () => get("/api/auth/verify", true),
      changePassword: (current_password, new_password) => post("/api/admin/change-password", { current_password, new_password }, true)
    },
    // ── Public ──────────────────────────────────────────────────────────────────
    properties: {
      list: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([k, v]) => {
          if (v) params.set(k, v);
        });
        const qs = params.toString();
        return get(`/api/properties${qs ? "?" + qs : ""}`);
      },
      get: (id) => get(`/api/properties/${id}`),
      getBySlug: (slug) => get(`/api/properties/slug/${slug}`)
    },
    // ── Admin ────────────────────────────────────────────────────────────────────
    admin: {
      listProperties: () => get("/api/admin/properties", true),
      getPropertyBySlug: (slug) => get(`/api/admin/properties/slug/${slug}`, true),
      createProperty: (data) => post("/api/admin/properties", data, true),
      updateProperty: (id, data) => put(`/api/admin/properties/${id}`, data),
      deleteProperty: (id) => del(`/api/admin/properties/${id}`),
      togglePublish: (id) => patch(`/api/admin/properties/${id}/publish`, {}),
      featureProperty: (id) => patch(`/api/admin/properties/${id}/feature`, {}),
      listInquiries: () => get("/api/admin/inquiries", true),
      updateInquiry: (id, data) => patch(`/api/admin/inquiries/${id}`, data),
      getStats: () => get("/api/admin/stats", true)
    },
    inquiries: {
      create: (data) => post("/api/inquiries", data)
    },
    contact: (data) => post("/api/contact", data),
    saveToken: (token) => localStorage.setItem("erowho_token", token),
    clearToken: () => localStorage.removeItem("erowho_token"),
    hasToken: () => !!getToken()
  };

  // src/components/ui.tsx
  var import_react2 = __toESM(require_react());

  // src/illustrations.tsx
  var import_react = __toESM(require_react());
  var import_jsx_runtime = __toESM(require_jsx_runtime());
  function PropImage({ property, height = 220, className, style }) {
    const fallbackUrl = PROPERTY_IMAGES[property.property_type] || PROPERTY_IMAGES["default"];
    const primaryUrl = property.image_url && property.image_url.trim() !== "" ? property.image_url : fallbackUrl;
    const [src, setSrc] = (0, import_react.useState)(primaryUrl);
    const handleError = () => {
      if (src !== fallbackUrl) setSrc(fallbackUrl);
    };
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        className,
        style: {
          position: "relative",
          overflow: "hidden",
          height,
          background: C.sand,
          ...style
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "img",
          {
            src,
            alt: property.title,
            onError: handleError,
            style: {
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.5s ease"
            }
          }
        )
      }
    );
  }
  function PropTypeImage({ propertyType, height = 160, style }) {
    const url = PROPERTY_IMAGES[propertyType] || PROPERTY_IMAGES["default"];
    const [src, setSrc] = (0, import_react.useState)(url);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { position: "relative", overflow: "hidden", height, background: C.sand, borderRadius: 8, ...style }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "img",
        {
          src,
          alt: propertyType,
          onError: () => setSrc(PROPERTY_IMAGES["default"]),
          style: { width: "100%", height: "100%", objectFit: "cover", display: "block" }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        background: "linear-gradient(to top, rgba(42,33,27,0.6) 0%, transparent 100%)",
        padding: "12px 14px"
      }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 11, color: "#FAF6F0", letterSpacing: "0.1em", fontFamily: "'DM Mono', monospace" }, children: propertyType.toUpperCase() }) })
    ] });
  }

  // src/components/ui.tsx
  var import_jsx_runtime2 = __toESM(require_jsx_runtime());
  function StatusBadge({ status }) {
    const s = STATUS_STYLE[status] || STATUS_STYLE["Under Review"];
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: {
      background: s.bg,
      color: s.text,
      border: `1px solid ${s.border}`,
      padding: "3px 11px",
      borderRadius: 20,
      fontSize: 11,
      letterSpacing: "0.06em",
      fontWeight: 600,
      display: "inline-block",
      lineHeight: 1.8,
      whiteSpace: "nowrap"
    }, children: status });
  }
  function Spinner({ size = 24, color = C.gold }) {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
      width: size,
      height: size,
      border: `2px solid ${color}30`,
      borderTopColor: color,
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite",
      flexShrink: 0
    } });
  }
  function PageLoader() {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh" }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Spinner, { size: 32 }) });
  }
  function ErrorMsg({ msg }) {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
      background: "#FDF0EE",
      border: "1px solid #DDBBBB",
      borderRadius: 8,
      padding: "12px 16px",
      color: "#9A4040",
      fontSize: 14
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("i", { className: "fas fa-circle-exclamation", style: { marginRight: 8 } }),
      msg
    ] });
  }
  function PropertyCard({ prop, onClick }) {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "pcard fade-in", onClick: () => onClick(prop), children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "pcard-img", style: { height: 220, overflow: "hidden", position: "relative" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PropImage, { property: prop, height: 220 }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { position: "absolute", top: 12, right: 12 }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(StatusBadge, { status: prop.availability_status }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { padding: "20px 22px 22px" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h3", { style: {
          fontFamily: F.serif,
          fontSize: 20,
          fontWeight: 500,
          color: C.text,
          lineHeight: 1.2,
          flex: 1,
          marginRight: 10
        }, children: prop.title }) }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("p", { style: { fontSize: 13, color: C.muted, marginBottom: 14, display: "flex", alignItems: "center", gap: 5 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("i", { className: "fas fa-location-dot", style: { color: C.clay, fontSize: 11 } }),
          prop.city,
          ", ",
          prop.country
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", gap: 18, marginBottom: 14 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { fontSize: 13, color: C.muted, display: "flex", alignItems: "center", gap: 5 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("i", { className: "fas fa-bed", style: { color: C.clay, fontSize: 11 } }),
            prop.bedrooms,
            " ",
            prop.bedrooms === 1 ? "bed" : "beds"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { fontSize: 13, color: C.muted, display: "flex", alignItems: "center", gap: 5 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("i", { className: "fas fa-shower", style: { color: C.clay, fontSize: 11 } }),
            prop.bathrooms,
            " ",
            prop.bathrooms === 1 ? "bath" : "baths"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { fontSize: 13, color: C.muted, display: "flex", alignItems: "center", gap: 5 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("i", { className: "fas fa-home", style: { color: C.clay, fontSize: 11 } }),
            prop.property_type
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("p", { style: { fontSize: 13, color: C.muted, lineHeight: 1.65, marginBottom: 16 }, children: [
          prop.description.slice(0, 105),
          prop.description.length > 105 ? "\u2026" : ""
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: `1px solid ${C.stone}` }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { fontFamily: F.serif, fontSize: 22, fontWeight: 500, color: C.espresso }, children: [
            "$",
            prop.monthly_rent.toLocaleString(),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 13, fontWeight: 300, color: C.muted, fontFamily: F.sans }, children: "/mo" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { color: C.gold, fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 5 }, children: [
            "View Details ",
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("i", { className: "fas fa-arrow-right", style: { fontSize: 11 } })
          ] })
        ] })
      ] })
    ] });
  }
  function Navbar({
    currentPage,
    navigate,
    transparent = false
  }) {
    const [scrolled, setScrolled] = (0, import_react2.useState)(false);
    const [menuOpen, setMenuOpen] = (0, import_react2.useState)(false);
    (0, import_react2.useEffect)(() => {
      const fn = () => setScrolled(window.scrollY > 60);
      window.addEventListener("scroll", fn);
      return () => window.removeEventListener("scroll", fn);
    }, []);
    const isAtTop = !scrolled;
    const onHero = currentPage === "Home" && isAtTop;
    const links = [
      ["Home", "Home"],
      ["Rentals", "Rentals"],
      ["About", "About"],
      ["Portfolio", "Portfolio"],
      ["Process", "Our Process"],
      ["Contact", "Contact"]
    ];
    const navBg = onHero ? "rgba(42,33,27,0.15)" : scrolled ? "rgba(250,246,240,0.97)" : "rgba(250,246,240,0.95)";
    const navBorder = onHero ? "rgba(215,199,181,0.15)" : "rgba(215,199,181,0.8)";
    const logoColor = onHero ? "#FAF6F0" : C.espresso;
    const logoSub = onHero ? "rgba(215,199,181,0.8)" : C.clay;
    const linkColor = onHero ? "rgba(250,246,240,0.85)" : C.muted;
    const linkActive = onHero ? "#FAF6F0" : C.espresso;
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("nav", { style: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1e3,
      background: navBg,
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom: `1px solid ${navBorder}`,
      transition: "all 0.3s ease"
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
        maxWidth: 1240,
        margin: "0 auto",
        padding: "0 28px",
        height: 68,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { onClick: () => navigate("Home"), style: { cursor: "pointer" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: {
            fontFamily: F.serif,
            fontSize: 21,
            fontWeight: 400,
            color: logoColor,
            letterSpacing: "0.03em",
            display: "block",
            lineHeight: 1.2,
            transition: "color 0.3s"
          }, children: "Erowho Holdings Limited" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 8.5, color: logoSub, letterSpacing: "0.22em", transition: "color 0.3s" }, children: "RENTAL PROPERTY HOLDINGS" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "nav-desktop", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { display: "flex", gap: 26 }, children: links.map(([page, label]) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "button",
            {
              className: "nav-lnk",
              onClick: () => navigate(page),
              style: {
                color: currentPage === page ? linkActive : linkColor,
                borderBottom: `1.5px solid ${currentPage === page ? C.gold : "transparent"}`,
                paddingBottom: 2,
                letterSpacing: "0.02em",
                fontWeight: currentPage === page ? 500 : 400,
                transition: "color 0.2s"
              },
              children: label
            },
            page
          )) }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "button",
            {
              className: "btn-primary",
              onClick: () => navigate("Rentals"),
              style: { padding: "9px 20px", fontSize: 13, letterSpacing: "0.03em" },
              children: "View Rentals"
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "button",
          {
            className: "nav-hamburger",
            onClick: () => setMenuOpen((o) => !o),
            "aria-label": "Toggle menu",
            style: { color: onHero ? "#FAF6F0" : C.espresso },
            children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("i", { className: `fas ${menuOpen ? "fa-xmark" : "fa-bars"}`, style: { fontSize: 22 } })
          }
        )
      ] }),
      menuOpen && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
        position: "absolute",
        top: 68,
        left: 0,
        right: 0,
        zIndex: 999,
        background: "rgba(250,246,240,0.98)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: `1px solid ${C.stone}`,
        padding: "8px 24px 20px"
      }, children: [
        links.map(([page, label]) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "button",
          {
            onClick: () => {
              navigate(page);
              setMenuOpen(false);
            },
            style: {
              display: "block",
              width: "100%",
              textAlign: "left",
              padding: "13px 0",
              fontSize: 15,
              color: currentPage === page ? C.espresso : C.muted,
              fontWeight: currentPage === page ? 500 : 400,
              background: "none",
              border: "none",
              cursor: "pointer",
              borderBottom: `1px solid ${C.stone}`
            },
            children: label
          },
          page
        )),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "button",
          {
            className: "btn-primary",
            onClick: () => {
              navigate("Rentals");
              setMenuOpen(false);
            },
            style: { marginTop: 16, width: "100%", padding: "13px 0", fontSize: 14 },
            children: "View Rentals"
          }
        )
      ] })
    ] });
  }
  function Footer({ navigate }) {
    const links = [
      ["Home", "Home"],
      ["Rentals", "Rentals"],
      ["About", "About"],
      ["Portfolio", "Portfolio"],
      ["Process", "Our Process"],
      ["Contact", "Contact"]
    ];
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("footer", { style: { background: C.espresso, padding: "60px 28px 32px" }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { maxWidth: 1240, margin: "0 auto" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "footer-grid", style: { borderBottom: `1px solid rgba(215,199,181,0.12)` }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { style: { fontFamily: F.serif, fontSize: 22, color: "#FAF6F0", marginBottom: 3 }, children: "Erowho Holdings Limited" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { style: { fontSize: 9, color: C.clay, letterSpacing: "0.22em", marginBottom: 16 }, children: "RENTAL PROPERTY HOLDINGS" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { style: { fontSize: 13.5, color: "rgba(215,199,181,0.7)", lineHeight: 1.82, maxWidth: 340 }, children: "Acquiring, owning, and managing income-producing rental properties across Canada and the United States for the long term." }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { display: "flex", gap: 14, marginTop: 22 }, children: [
            ["fas fa-map-marker-alt", "Canada & United States"],
            ["fas fa-building", "Residential Rentals"]
          ].map(([icon, label]) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { fontSize: 12, color: "rgba(200,168,107,0.6)", display: "flex", alignItems: "center", gap: 6 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("i", { className: icon, style: { fontSize: 10 } }),
            label
          ] }, label)) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { style: { fontSize: 10, color: C.clay, letterSpacing: "0.18em", marginBottom: 16, fontWeight: 500 }, children: "NAVIGATE" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: links.map(([page, label]) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "button",
            {
              className: "nav-lnk",
              onClick: () => navigate(page),
              style: { color: "rgba(215,199,181,0.65)", textAlign: "left", fontSize: 13.5 },
              onMouseEnter: (e) => e.currentTarget.style.color = C.gold,
              onMouseLeave: (e) => e.currentTarget.style.color = "rgba(215,199,181,0.65)",
              children: label
            },
            page
          )) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { style: { fontSize: 10, color: C.clay, letterSpacing: "0.18em", marginBottom: 16, fontWeight: 500 }, children: "RENTALS" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: [
            ["Rentals", "Available Properties"],
            ["Rentals", "Coming Soon"],
            ["Contact", "Rental Inquiries"],
            ["AdminLogin", "Admin Login"]
          ].map(([page, label]) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "button",
            {
              className: "nav-lnk",
              onClick: () => navigate(page),
              style: {
                color: page === "AdminLogin" ? "rgba(215,199,181,0.25)" : "rgba(215,199,181,0.65)",
                textAlign: "left",
                fontSize: page === "AdminLogin" ? 11 : 13.5,
                letterSpacing: page === "AdminLogin" ? "0.08em" : "normal"
              },
              onMouseEnter: (e) => e.currentTarget.style.color = C.gold,
              onMouseLeave: (e) => e.currentTarget.style.color = page === "AdminLogin" ? "rgba(215,199,181,0.25)" : "rgba(215,199,181,0.65)",
              children: label
            },
            label
          )) })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { style: { fontSize: 12, color: "rgba(215,199,181,0.4)", lineHeight: 1.85, maxWidth: 860, marginBottom: 14 }, children: "Erowho Holdings Limited is a real estate investment and holding company. Rental availability is limited to properties owned, operated, or controlled by Erowho Holdings Limited. Website content is for informational purposes only and does not constitute brokerage, financial, legal, or investment advice." }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("p", { style: { fontSize: 11, color: "rgba(215,199,181,0.25)" }, children: [
        "\xA9 ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Erowho Holdings Limited. All rights reserved."
      ] })
    ] }) });
  }

  // src/pages/public.tsx
  var import_react3 = __toESM(require_react());
  var import_jsx_runtime3 = __toESM(require_jsx_runtime());
  function Label({ children, light = false }) {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: {
      fontSize: 10,
      letterSpacing: "0.22em",
      fontWeight: 600,
      color: light ? "rgba(200,168,107,0.8)" : C.terracotta,
      marginBottom: 12,
      textTransform: "uppercase"
    }, children });
  }
  function HomePage({ navigate }) {
    const [featured, setFeatured] = (0, import_react3.useState)([]);
    const [loading, setLoading] = (0, import_react3.useState)(true);
    const [heroSearch, setHeroSearch] = (0, import_react3.useState)({ location: "", beds: "", maxRent: "" });
    const [activePhase, setActivePhase] = (0, import_react3.useState)(null);
    (0, import_react3.useEffect)(() => {
      api.properties.list().then((ps) => {
        setFeatured(ps.slice(0, 3));
        setLoading(false);
      }).catch(() => setLoading(false));
    }, []);
    const doHeroSearch = () => {
      const filters = {};
      if (heroSearch.location) filters.q = heroSearch.location;
      if (heroSearch.beds) filters.bedrooms = heroSearch.beds;
      if (heroSearch.maxRent) filters.max_rent = heroSearch.maxRent;
      navigate("Rentals", Object.keys(filters).length ? filters : void 0);
    };
    const phases = [
      { n: "01", title: "First Acquisitions", desc: "Identifying and securing rental assets in selected markets guided by long-term fundamentals." },
      { n: "02", title: "Stabilize & Rent", desc: "Preparing properties and establishing stable, responsibly managed rental operations." },
      { n: "03", title: "Improve & Optimize", desc: "Improving property quality, tenant experience, and operating efficiency where appropriate." },
      { n: "04", title: "Expand Markets", desc: "Growing into additional Canadian and U.S. markets where demand and ownership fundamentals align." },
      { n: "05", title: "Diversified Portfolio", desc: "Building a mature, income-producing rental portfolio held for the long term." }
    ];
    const principles = [
      { icon: "fa-clock-rotate-left", title: "Long-Term Ownership", desc: "We acquire to hold, not to flip. Every property is managed with permanence in mind." },
      { icon: "fa-seedling", title: "Responsible Growth", desc: "Portfolio expansion guided by fundamentals, not momentum or market noise." },
      { icon: "fa-house-chimney", title: "Stable Housing", desc: "Providing quality rental homes that tenants can rely on over time." },
      { icon: "fa-magnifying-glass-chart", title: "Disciplined Acquisition", desc: "Every property passes through a careful review before joining our portfolio." },
      { icon: "fa-earth-americas", title: "Cross-Border Vision", desc: "Operating across Canada and the United States with a unified investment approach." },
      { icon: "fa-handshake", title: "Tenant Respect", desc: "We treat tenants as the foundation of a well-run portfolio, not a transaction." }
    ];
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("section", { style: {
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden"
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { position: "absolute", inset: 0 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "img",
            {
              src: HERO_IMAGE,
              alt: "Residential rental homes on a quiet street",
              style: { width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: {
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, rgba(40,15,3,0.91) 0%, rgba(48,20,5,0.78) 30%, rgba(46,18,4,0.46) 58%, rgba(30,10,2,0.08) 100%)"
          } }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: {
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(30,10,2,0.32) 0%, transparent 40%)"
          } })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "hero-content", style: { position: "relative", zIndex: 1 }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { maxWidth: 680 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Label, { light: true, children: "EROWHO HOLDINGS \xB7 CANADA & UNITED STATES" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("h1", { style: {
            fontFamily: F.serif,
            fontSize: "clamp(38px, 5.2vw, 68px)",
            fontWeight: 300,
            color: "#FAF6F0",
            lineHeight: 1.08,
            marginBottom: 24,
            letterSpacing: "-0.01em"
          }, children: [
            "Find Rental Homes",
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("br", {}),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("em", { style: { color: C.gold, fontStyle: "italic" }, children: "Owned for the Long Term" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: {
            fontSize: 17,
            color: "rgba(250,246,240,0.95)",
            lineHeight: 1.82,
            marginBottom: 44,
            maxWidth: 530
          }, children: "Erowho Holdings Limited acquires, owns, and manages income-producing rental properties across Canada and the United States, offering stable rental housing through a growing long-term portfolio." }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "glass-card", style: { padding: "22px 24px", maxWidth: 680, marginBottom: 36 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("p", { style: { fontSize: 11, color: C.clay, letterSpacing: "0.14em", marginBottom: 14, fontWeight: 600 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: "fas fa-magnifying-glass", style: { marginRight: 7 } }),
              "FIND A RENTAL"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "hero-search-grid", children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("label", { style: { fontSize: 10, color: C.muted, letterSpacing: "0.1em", display: "block", marginBottom: 5 }, children: "LOCATION" }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { position: "relative" }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: "fas fa-location-dot", style: {
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: C.clay,
                    fontSize: 12,
                    pointerEvents: "none"
                  } }),
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                    "input",
                    {
                      className: "inp",
                      value: heroSearch.location,
                      onChange: (e) => setHeroSearch({ ...heroSearch, location: e.target.value }),
                      placeholder: "City or country\u2026",
                      style: { paddingLeft: 32 },
                      onKeyDown: (e) => e.key === "Enter" && doHeroSearch()
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("label", { style: { fontSize: 10, color: C.muted, letterSpacing: "0.1em", display: "block", marginBottom: 5 }, children: "BEDROOMS" }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { position: "relative" }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: "fas fa-bed", style: {
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: C.clay,
                    fontSize: 11,
                    pointerEvents: "none",
                    zIndex: 1
                  } }),
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("select", { className: "inp", value: heroSearch.beds, onChange: (e) => setHeroSearch({ ...heroSearch, beds: e.target.value }), style: { paddingLeft: 32, cursor: "pointer" }, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "", children: "Any" }),
                    [1, 2, 3, 4].map((n) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("option", { value: n, children: [
                      n,
                      "+"
                    ] }, n))
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("label", { style: { fontSize: 10, color: C.muted, letterSpacing: "0.1em", display: "block", marginBottom: 5 }, children: "MAX RENT" }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { position: "relative" }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: "fas fa-dollar-sign", style: {
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: C.clay,
                    fontSize: 12,
                    pointerEvents: "none"
                  } }),
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                    "input",
                    {
                      className: "inp",
                      type: "number",
                      value: heroSearch.maxRent,
                      onChange: (e) => setHeroSearch({ ...heroSearch, maxRent: e.target.value }),
                      placeholder: "No limit",
                      style: { paddingLeft: 30 }
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
                "button",
                {
                  className: "btn-primary",
                  onClick: doHeroSearch,
                  style: { padding: "10px 20px", marginTop: 21, whiteSpace: "nowrap", alignSelf: "flex-end" },
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: "fas fa-magnifying-glass", style: { marginRight: 7 } }),
                    "Search"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", gap: 14, flexWrap: "wrap" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: "btn-primary", onClick: () => navigate("Rentals"), style: { padding: "14px 30px" }, children: "View Available Rentals" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: "btn-outline-dark", onClick: () => navigate("About"), style: { padding: "14px 28px" }, children: "Learn About Erowho Holdings Limited" })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: {
          position: "absolute",
          bottom: 36,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          zIndex: 1
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 9, color: "rgba(215,199,181,0.5)", letterSpacing: "0.18em" }, children: "SCROLL" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: "fas fa-chevron-down", style: { color: "rgba(215,199,181,0.4)", fontSize: 12, animation: "fadeIn 1s ease infinite alternate" } })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("section", { style: { background: C.ivory, padding: "92px 28px" }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { maxWidth: 1240, margin: "0 auto" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 52 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Label, { children: "Current Listings" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { style: { fontFamily: F.serif, fontSize: 44, fontWeight: 300, color: C.text, lineHeight: 1.1 }, children: "Available Rentals" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { color: C.muted, marginTop: 10, fontSize: 15 }, children: "Properties owned, operated, or controlled by Erowho Holdings Limited." })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("button", { className: "btn-outline", onClick: () => navigate("Rentals"), style: { padding: "10px 22px", whiteSpace: "nowrap" }, children: [
            "View All ",
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: "fas fa-arrow-right", style: { marginLeft: 6, fontSize: 11 } })
          ] })
        ] }),
        loading ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(PageLoader, {}) : featured.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { textAlign: "center", padding: "60px 0" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: "fas fa-home", style: { fontSize: 40, color: C.stone, marginBottom: 16, display: "block" } }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { color: C.muted }, children: "No rentals available at the moment. Check back soon." })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }, children: featured.map((p) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(PropertyCard, { prop: p, onClick: (prop) => navigate("PropertyDetail", prop) }, p.id)) }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { textAlign: "center", marginTop: 52 }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: "btn-primary", onClick: () => navigate("Rentals"), style: { padding: "14px 36px" }, children: "Browse All Properties" }) })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("section", { style: { background: C.sand, padding: "96px 28px" }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Label, { children: "Rental Match Preview" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { style: { fontFamily: F.serif, fontSize: 44, fontWeight: 300, color: C.text, lineHeight: 1.15, marginBottom: 22 }, children: "Homes Ready for Long-Term Renters" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { color: C.muted, lineHeight: 1.85, fontSize: 15, marginBottom: 32 }, children: "Each property in the Erowho Holdings Limited portfolio is owned and managed by us \u2014 not listed by a third-party agent or brokerage. When you inquire, you deal directly with the company that owns the home." }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { display: "flex", flexDirection: "column", gap: 14, marginBottom: 36 }, children: [
            { icon: "fa-handshake", text: "Inquire directly with the property owner" },
            { icon: "fa-clock-rotate-left", text: "Stable, long-term rental terms" },
            { icon: "fa-house-chimney-user", text: "Professionally managed residential homes" }
          ].map(({ icon, text }) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 12 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: `fas ${icon}`, style: { color: C.gold, fontSize: 15, width: 20, textAlign: "center" } }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 14, color: C.text }, children: text })
          ] }, text)) }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: "btn-primary", onClick: () => navigate("Rentals"), style: { padding: "13px 28px" }, children: "Browse All Rentals" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { children: (() => {
          const spotlight = featured.find((p) => p.availability_status === "Available") || featured[0];
          if (!spotlight) return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { background: "#FFF", border: `1px solid ${C.stone}`, borderRadius: 16, padding: "48px 32px", textAlign: "center" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: "fas fa-key", style: { fontSize: 40, color: C.stone, display: "block", marginBottom: 18 } }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { style: { fontFamily: F.serif, fontSize: 22, color: C.text, marginBottom: 10 }, children: "New Listings Coming Soon" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { fontSize: 14, color: C.muted, lineHeight: 1.75 }, children: "Erowho Holdings Limited is actively growing its rental portfolio. Check back soon for new available properties." })
          ] });
          return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
            "div",
            {
              onClick: () => navigate("PropertyDetail", spotlight),
              style: { background: "#FFF", border: `1px solid ${C.stone}`, borderRadius: 16, overflow: "hidden", cursor: "pointer", boxShadow: "0 16px 48px rgba(42,33,27,0.12)", transition: "transform 0.25s, box-shadow 0.25s" },
              onMouseEnter: (e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 26px 64px rgba(42,33,27,0.18)";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 16px 48px rgba(42,33,27,0.12)";
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { position: "relative", height: 270 }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(PropImage, { property: spotlight, height: 270 }),
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(42,33,27,0.6) 0%, transparent 55%)" } }),
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { position: "absolute", bottom: 16, left: 20, right: 20 }, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { style: { fontFamily: F.serif, fontSize: 24, color: "#FAF6F0", marginBottom: 4 }, children: spotlight.title }),
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("p", { style: { fontSize: 13, color: "rgba(250,246,240,0.78)", display: "flex", alignItems: "center", gap: 6 }, children: [
                      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: "fas fa-location-dot" }),
                      spotlight.city,
                      ", ",
                      spotlight.country
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { position: "absolute", top: 14, right: 14 }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(StatusBadge, { status: spotlight.availability_status }) })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { padding: "20px 22px" }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { display: "flex", gap: 20 }, children: [
                      { icon: "fa-bed", val: `${spotlight.bedrooms} bed` },
                      { icon: "fa-shower", val: `${spotlight.bathrooms} bath` },
                      { icon: "fa-home", val: spotlight.property_type }
                    ].map(({ icon, val }) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { style: { fontSize: 13, color: C.muted, display: "flex", alignItems: "center", gap: 5 }, children: [
                      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: `fas ${icon}`, style: { color: C.clay, fontSize: 11 } }),
                      val
                    ] }, val)) }),
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { style: { fontFamily: F.serif, fontSize: 21, color: C.espresso }, children: [
                      "$",
                      spotlight.monthly_rent.toLocaleString(),
                      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 12, color: C.muted, fontFamily: F.sans }, children: "/mo" })
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.stone}`, display: "flex", justifyContent: "flex-end" }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { style: { color: C.gold, fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 5 }, children: [
                    "View Property ",
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: "fas fa-arrow-right", style: { fontSize: 11 } })
                  ] }) })
                ] })
              ]
            }
          );
        })() })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("section", { style: { background: C.charcoal, padding: "96px 28px", position: "relative", overflow: "hidden" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: {
          position: "absolute",
          right: -80,
          top: "50%",
          transform: "translateY(-50%)",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,168,107,0.06) 0%, transparent 70%)",
          pointerEvents: "none"
        } }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", position: "relative", zIndex: 1 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Label, { light: true, children: "Who We Are" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { style: {
              fontFamily: F.serif,
              fontSize: 42,
              fontWeight: 300,
              color: "#FAF6F0",
              lineHeight: 1.18,
              marginBottom: 22
            }, children: "A Holding Company Built Around Long-Term Rental Ownership" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { color: "rgba(215,199,181,0.7)", lineHeight: 1.85, marginBottom: 20, fontSize: 15 }, children: "Erowho Holdings Limited is a privately held real estate investment company focused on acquiring, owning, improving, and managing rental properties across Canada and the United States." }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: {
              background: "rgba(200,168,107,0.08)",
              border: "1px solid rgba(200,168,107,0.18)",
              borderRadius: 10,
              padding: "14px 18px",
              marginBottom: 28
            }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("p", { style: { fontSize: 13, color: "rgba(200,168,107,0.85)", lineHeight: 1.7 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: "fas fa-circle-info", style: { marginRight: 8 } }),
              "We are not a brokerage or public listing marketplace. The rentals shown on this website are properties owned, operated, or controlled by Erowho Holdings Limited."
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("button", { className: "btn-outline-dark", onClick: () => navigate("About"), style: { padding: "11px 24px" }, children: [
              "Learn More ",
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: "fas fa-arrow-right", style: { marginLeft: 7, fontSize: 11 } })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }, children: [
            { icon: "fa-magnifying-glass", title: "Acquire", desc: "We identify and acquire rental properties in selected markets guided by long-term fundamentals." },
            { icon: "fa-building", title: "Own", desc: "We hold rental assets for the long term, focusing on stability and responsible stewardship." },
            { icon: "fa-screwdriver-wrench", title: "Improve", desc: "We improve property quality, tenant experience, and long-term value where appropriate." },
            { icon: "fa-house-user", title: "Rent", desc: "We provide stable rental housing through properties we own, operate, and control." }
          ].map(({ icon, title, desc }) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
            "div",
            {
              style: {
                background: "rgba(74,62,52,0.5)",
                border: "1px solid rgba(90,78,68,0.5)",
                borderRadius: 12,
                padding: "22px 18px",
                transition: "border-color 0.2s, background 0.2s"
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.borderColor = "rgba(200,168,107,0.35)";
                e.currentTarget.style.background = "rgba(74,62,52,0.8)";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.borderColor = "rgba(90,78,68,0.5)";
                e.currentTarget.style.background = "rgba(74,62,52,0.5)";
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: `fas ${icon}`, style: { color: C.gold, fontSize: 18, marginBottom: 12, display: "block" } }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { style: { fontFamily: F.serif, fontSize: 19, fontWeight: 400, color: "#FAF6F0", marginBottom: 8 }, children: title }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { fontSize: 13, color: "rgba(215,199,181,0.6)", lineHeight: 1.7 }, children: desc })
              ]
            },
            title
          )) })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("section", { style: { background: C.sand, padding: "96px 28px" }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { maxWidth: 1100, margin: "0 auto" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { textAlign: "center", marginBottom: 64 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Label, { children: "Strategic Roadmap" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { style: { fontFamily: F.serif, fontSize: 46, fontWeight: 300, color: C.text, marginBottom: 14 }, children: "Portfolio Growth Vision" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { color: C.muted, maxWidth: 480, margin: "0 auto", lineHeight: 1.78, fontSize: 15 }, children: "Acquire thoughtfully, stabilize responsibly, improve where needed, and grow with discipline." })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", position: "relative", alignItems: "flex-start" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: {
            position: "absolute",
            top: 28,
            left: "9%",
            right: "9%",
            height: 1,
            background: C.stone
          } }),
          phases.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
            "div",
            {
              onClick: () => setActivePhase(activePhase === i ? null : i),
              style: { flex: 1, textAlign: "center", cursor: "pointer", padding: "0 8px", position: "relative" },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: {
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: activePhase === i ? C.gold : "#FFF",
                  border: `2px solid ${activePhase === i ? C.gold : C.stone}`,
                  margin: "0 auto 18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.28s",
                  position: "relative",
                  zIndex: 1,
                  boxShadow: activePhase === i ? "0 6px 20px rgba(200,168,107,0.35)" : "none"
                }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontFamily: F.mono, fontSize: 11, color: activePhase === i ? C.espresso : C.muted }, children: p.n }) }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h4", { style: {
                  fontFamily: F.serif,
                  fontSize: 14.5,
                  color: activePhase === i ? C.espresso : C.muted,
                  transition: "color 0.28s",
                  lineHeight: 1.3,
                  marginBottom: 8
                }, children: p.title }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: {
                  overflow: "hidden",
                  maxHeight: activePhase === i ? 120 : 0,
                  opacity: activePhase === i ? 1 : 0,
                  transition: "max-height 0.4s, opacity 0.3s"
                }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { fontSize: 12.5, color: C.muted, lineHeight: 1.68, marginTop: 4 }, children: p.desc }) })
              ]
            },
            i
          ))
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { textAlign: "center", fontSize: 10, color: C.subtle, marginTop: 36, letterSpacing: "0.12em" }, children: "CLICK EACH PHASE TO EXPAND" })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("section", { style: { background: "#FFF", padding: "88px 28px" }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { maxWidth: 880, margin: "0 auto" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { textAlign: "center", marginBottom: 52 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Label, { children: "Acquisition Criteria" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { style: { fontFamily: F.serif, fontSize: 44, fontWeight: 300, color: C.text, marginBottom: 14 }, children: "Property Review Lens" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { color: C.muted, lineHeight: 1.78, fontSize: 15, maxWidth: 500, margin: "0 auto" }, children: "Before adding a property to our portfolio, we consider the fundamentals that support long-term rental ownership." })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 12 }, children: [
          { icon: "fa-chart-bar", label: "Rental demand" },
          { icon: "fa-map-location-dot", label: "Neighborhood fundamentals" },
          { icon: "fa-dollar-sign", label: "Rental performance potential" },
          { icon: "fa-screwdriver-wrench", label: "Property condition" },
          { icon: "fa-clock-rotate-left", label: "Long-term ownership value" },
          { icon: "fa-people-group", label: "Tenant suitability" },
          { icon: "fa-building-columns", label: "Market stability" }
        ].map(({ icon, label }) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
          "div",
          {
            style: {
              background: C.ivory,
              border: `1px solid ${C.stone}`,
              borderRadius: 10,
              padding: "16px 18px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s"
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.borderColor = C.gold;
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(42,33,27,0.08)";
              e.currentTarget.style.background = "#FFF";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.borderColor = C.stone;
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.background = C.ivory;
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: `fas ${icon}`, style: { color: C.gold, fontSize: 15, flexShrink: 0 } }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 14, color: C.text }, children: label })
            ]
          },
          label
        )) })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("section", { style: {
        background: C.espresso,
        padding: "96px 28px",
        position: "relative",
        overflow: "hidden"
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { position: "absolute", inset: 0, opacity: 0.04, pointerEvents: "none" }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { width: "100%", height: "100%", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("pattern", { id: "grid", width: "40", height: "40", patternUnits: "userSpaceOnUse", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M 40 0 L 0 0 0 40", fill: "none", stroke: C.gold, strokeWidth: "0.5" }) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("rect", { width: "100%", height: "100%", fill: "url(#grid)" })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { maxWidth: 1240, margin: "0 auto", position: "relative", zIndex: 1 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { textAlign: "center", marginBottom: 64 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Label, { light: true, children: "Our Markets" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { style: { fontFamily: F.serif, fontSize: 46, fontWeight: 300, color: "#FAF6F0", marginBottom: 14 }, children: "Canada & United States" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { color: "rgba(215,199,181,0.65)", maxWidth: 500, margin: "0 auto", lineHeight: 1.78, fontSize: 15 }, children: "Erowho Holdings Limited builds a geographically diversified rental portfolio across two of North America's largest residential markets." })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }, children: [
            {
              flag: "\u{1F1E8}\u{1F1E6}",
              country: "Canada",
              desc: "Focused on established Canadian rental markets with strong long-term demand and fundamentals \u2014 targeting residential properties suited to long-term holding.",
              highlights: ["Toronto, ON", "Ottawa, ON", "Calgary, AB", "Vancouver, BC"]
            },
            {
              flag: "\u{1F1FA}\u{1F1F8}",
              country: "United States",
              desc: "Exploring selected U.S. markets where rental demand, affordability, and population growth create sustainable long-term rental opportunities.",
              highlights: ["Dallas, TX", "Houston, TX", "Atlanta, GA", "Phoenix, AZ"]
            }
          ].map(({ flag, country, desc, highlights }) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: {
            background: "rgba(74,62,52,0.4)",
            border: "1px solid rgba(90,78,68,0.5)",
            borderRadius: 14,
            padding: "32px 28px"
          }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 36 }, children: flag }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { style: { fontFamily: F.serif, fontSize: 28, fontWeight: 300, color: "#FAF6F0" }, children: country })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { fontSize: 14, color: "rgba(215,199,181,0.65)", lineHeight: 1.8, marginBottom: 22 }, children: desc }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 }, children: highlights.map((h) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { style: {
              fontSize: 12,
              color: C.gold,
              background: "rgba(200,168,107,0.1)",
              border: "1px solid rgba(200,168,107,0.22)",
              padding: "4px 12px",
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              gap: 6
            }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: "fas fa-location-dot", style: { fontSize: 9 } }),
              h
            ] }, h)) })
          ] }, country)) })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("section", { style: { background: C.cream, padding: "96px 28px" }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { maxWidth: 1240, margin: "0 auto" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { textAlign: "center", marginBottom: 56 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Label, { children: "What Guides Us" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { style: { fontFamily: F.serif, fontSize: 46, fontWeight: 300, color: C.text }, children: "Our Principles" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }, children: principles.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
          "div",
          {
            style: {
              background: "#FFF",
              border: `1px solid ${C.stone}`,
              borderRadius: 14,
              padding: "28px 24px",
              transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s"
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 36px rgba(42,33,27,0.10)";
              e.currentTarget.style.borderColor = C.gold;
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = C.stone;
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: `fas ${p.icon}`, style: { color: C.gold, fontSize: 20, marginBottom: 14, display: "block" } }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { style: { fontFamily: F.serif, fontSize: 20, fontWeight: 400, color: C.text, marginBottom: 10 }, children: p.title }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { fontSize: 14, color: C.muted, lineHeight: 1.75 }, children: p.desc })
            ]
          },
          i
        )) })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("section", { style: {
        background: `linear-gradient(135deg, ${C.charcoal} 0%, ${C.espresso} 100%)`,
        padding: "88px 28px"
      }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }, children: [
        {
          tag: "FOR RENTERS",
          title: "Looking for a rental?",
          desc: "Browse available properties and submit a rental inquiry for any listing that interests you.",
          btn: "View Rentals",
          act: () => navigate("Rentals"),
          primary: true
        },
        {
          tag: "GENERAL INQUIRIES",
          title: "Have a question?",
          desc: "Contact Erowho Holdings Limited for general company or portfolio inquiries.",
          btn: "Contact Us",
          act: () => navigate("Contact"),
          primary: false
        }
      ].map(({ tag, title, desc, btn, act, primary }) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: {
        background: "rgba(74,62,52,0.4)",
        border: "1px solid rgba(90,78,68,0.5)",
        borderRadius: 14,
        padding: "34px 28px"
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Label, { light: true, children: tag }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { style: { fontFamily: F.serif, fontSize: 26, fontWeight: 300, color: "#FAF6F0", marginBottom: 12 }, children: title }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { fontSize: 14, color: "rgba(215,199,181,0.65)", lineHeight: 1.78, marginBottom: 24 }, children: desc }),
        primary ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: "btn-primary", onClick: act, style: { padding: "11px 24px" }, children: btn }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: "btn-outline-dark", onClick: act, style: { padding: "11px 24px" }, children: btn })
      ] }, tag)) }) })
    ] });
  }
  function RentalsPage({
    navigate,
    initialFilters = {}
  }) {
    const [properties, setProperties] = (0, import_react3.useState)([]);
    const [loading, setLoading] = (0, import_react3.useState)(true);
    const [error, setError] = (0, import_react3.useState)("");
    const [search, setSearch] = (0, import_react3.useState)(initialFilters.q || "");
    const [country, setCountry] = (0, import_react3.useState)(initialFilters.country || "");
    const [city, setCity] = (0, import_react3.useState)(initialFilters.city || "");
    const [propType, setPropType] = (0, import_react3.useState)(initialFilters.property_type || "");
    const [beds, setBeds] = (0, import_react3.useState)(initialFilters.bedrooms || "");
    const [baths, setBaths] = (0, import_react3.useState)(initialFilters.bathrooms || "");
    const [status, setStatus] = (0, import_react3.useState)(initialFilters.status || "");
    const [minRent, setMinRent] = (0, import_react3.useState)(initialFilters.min_rent || "");
    const [maxRent, setMaxRent] = (0, import_react3.useState)(initialFilters.max_rent || "");
    (0, import_react3.useEffect)(() => {
      setLoading(true);
      setError("");
      const f = {};
      if (search) f.q = search;
      if (country) f.country = country;
      if (city) f.city = city;
      if (propType) f.property_type = propType;
      if (beds) f.bedrooms = beds;
      if (baths) f.bathrooms = baths;
      if (status) f.status = status;
      if (minRent) f.min_rent = minRent;
      if (maxRent) f.max_rent = maxRent;
      api.properties.list(f).then((ps) => {
        setProperties(ps);
        setLoading(false);
      }).catch(() => {
        setError("Something went wrong while loading rentals. Please try again.");
        setLoading(false);
      });
    }, [search, country, city, propType, beds, baths, status, minRent, maxRent]);
    const clear = () => {
      setSearch("");
      setCountry("");
      setCity("");
      setPropType("");
      setBeds("");
      setBaths("");
      setStatus("");
      setMinRent("");
      setMaxRent("");
    };
    const hasFilters = !!(search || country || city || propType || beds || baths || status || minRent || maxRent);
    const FLabel = ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("label", { style: { fontSize: 10, color: C.subtle, letterSpacing: "0.12em", display: "block", marginBottom: 5, fontWeight: 600 }, children });
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { paddingTop: 68 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("section", { style: {
        background: `linear-gradient(180deg, ${C.charcoal} 0%, ${C.espresso} 100%)`,
        padding: "60px 28px 52px"
      }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { maxWidth: 1240, margin: "0 auto" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Label, { light: true, children: "EROWHO HOLDINGS" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h1", { style: { fontFamily: F.serif, fontSize: 50, fontWeight: 300, color: "#FAF6F0", marginBottom: 10 }, children: "Available Rentals" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { color: "rgba(215,199,181,0.65)", fontSize: 15, maxWidth: 540 }, children: "Browse rental properties owned, operated, or controlled by Erowho Holdings Limited across Canada and the United States." })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { background: "#FFF", borderBottom: `1px solid ${C.stone}`, padding: "18px 28px 20px", boxShadow: "0 2px 12px rgba(42,33,27,0.06)" }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { maxWidth: 1240, margin: "0 auto", display: "flex", flexDirection: "column", gap: 10 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 10, alignItems: "end" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(FLabel, { children: "SEARCH" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { position: "relative" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: "fas fa-magnifying-glass", style: { position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.clay, fontSize: 12, pointerEvents: "none" } }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { className: "inp", value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Property name or keyword", style: { paddingLeft: 32 }, "aria-label": "Search properties" })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(FLabel, { children: "COUNTRY" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("select", { className: "inp", value: country, onChange: (e) => setCountry(e.target.value), style: { cursor: "pointer" }, "aria-label": "Filter by country", children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "", children: "All Countries" }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { children: "Canada" }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { children: "United States" })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(FLabel, { children: "CITY" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { position: "relative" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: "fas fa-location-dot", style: { position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.clay, fontSize: 12, pointerEvents: "none" } }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { className: "inp", value: city, onChange: (e) => setCity(e.target.value), placeholder: "e.g. Toronto", style: { paddingLeft: 30 }, "aria-label": "Filter by city" })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(FLabel, { children: "TYPE" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("select", { className: "inp", value: propType, onChange: (e) => setPropType(e.target.value), style: { cursor: "pointer" }, "aria-label": "Filter by property type", children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "", children: "All Types" }),
              ["Single-Family Home", "Townhome", "Duplex", "Apartment", "Condo", "Multifamily"].map((t) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { children: t }, t))
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr auto", gap: 10, alignItems: "end" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(FLabel, { children: "MIN BEDS" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("select", { className: "inp", value: beds, onChange: (e) => setBeds(e.target.value), style: { cursor: "pointer" }, "aria-label": "Minimum bedrooms", children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "", children: "Any" }),
              [1, 2, 3, 4].map((n) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("option", { value: n, children: [
                n,
                "+"
              ] }, n))
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(FLabel, { children: "MIN BATHS" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("select", { className: "inp", value: baths, onChange: (e) => setBaths(e.target.value), style: { cursor: "pointer" }, "aria-label": "Minimum bathrooms", children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "", children: "Any" }),
              [1, 2, 3].map((n) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("option", { value: n, children: [
                n,
                "+"
              ] }, n))
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(FLabel, { children: "STATUS" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("select", { className: "inp", value: status, onChange: (e) => setStatus(e.target.value), style: { cursor: "pointer" }, "aria-label": "Availability status", children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "", children: "All" }),
              ["Available", "Coming Soon", "Rented", "Under Review"].map((s) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { children: s }, s))
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(FLabel, { children: "MIN RENT ($)" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { className: "inp", type: "number", min: "0", value: minRent, onChange: (e) => setMinRent(e.target.value), placeholder: "No min", "aria-label": "Minimum monthly rent" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(FLabel, { children: "MAX RENT ($)" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { className: "inp", type: "number", min: "0", value: maxRent, onChange: (e) => setMaxRent(e.target.value), placeholder: "No max", "aria-label": "Maximum monthly rent" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
            "button",
            {
              onClick: clear,
              disabled: !hasFilters,
              "aria-label": "Clear all filters",
              style: {
                background: "none",
                border: `1px solid ${hasFilters ? C.clay : C.stone}`,
                color: hasFilters ? C.muted : C.subtle,
                padding: "10px 14px",
                borderRadius: 8,
                fontSize: 12,
                cursor: hasFilters ? "pointer" : "default",
                whiteSpace: "nowrap",
                transition: "border-color 0.2s"
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: "fas fa-xmark", style: { marginRight: 5 } }),
                "Clear"
              ]
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { background: C.ivory, padding: "36px 28px 100px", minHeight: "50vh" }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { maxWidth: 1240, margin: "0 auto" }, children: [
        error && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { marginBottom: 24 }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ErrorMsg, { msg: error }) }),
        loading ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(PageLoader, {}) : /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("p", { style: { fontSize: 13, color: C.subtle }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: "fas fa-list", style: { marginRight: 7, color: C.clay } }),
              properties.length,
              " ",
              properties.length === 1 ? "property" : "properties",
              " found",
              hasFilters && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { color: C.terracotta, marginLeft: 8 }, children: "\xB7 Filtered" })
            ] }),
            hasFilters && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("button", { onClick: clear, style: { background: "none", border: "none", color: C.terracotta, fontSize: 13, cursor: "pointer" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: "fas fa-rotate-left", style: { marginRight: 5 } }),
              "Reset filters"
            ] })
          ] }),
          properties.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { textAlign: "center", padding: "80px 0" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: "fas fa-house-circle-xmark", style: { fontSize: 48, color: C.stone, display: "block", marginBottom: 20 } }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { fontFamily: F.serif, fontSize: 24, color: C.text, marginBottom: 12 }, children: "No rentals match your search" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("p", { style: { fontSize: 14, color: C.muted, lineHeight: 1.75, maxWidth: 440, margin: "0 auto 26px" }, children: [
              "Adjust your filters or",
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { onClick: () => navigate("Contact"), style: { background: "none", border: "none", color: C.gold, cursor: "pointer", fontSize: 14, padding: 0, textDecoration: "underline" }, children: "submit a rental inquiry" }),
              " ",
              "and we'll contact you when a suitable property becomes available."
            ] }),
            hasFilters && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: "btn-primary", onClick: clear, style: { padding: "11px 28px" }, children: "Clear All Filters" })
          ] }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }, children: properties.map((p) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(PropertyCard, { prop: p, onClick: (prop) => navigate("PropertyDetail", prop) }, p.id)) })
        ] })
      ] }) })
    ] });
  }
  function PropertyDetailPage({ property, navigate }) {
    const [form, setForm] = (0, import_react3.useState)({ name: "", email: "", phone: "", moveIn: "", occupants: "", message: "" });
    const [submitting, setSubmitting] = (0, import_react3.useState)(false);
    const [done, setDone] = (0, import_react3.useState)(false);
    const [error, setError] = (0, import_react3.useState)("");
    const [activeImg, setActiveImg] = (0, import_react3.useState)(0);
    (0, import_react3.useEffect)(() => {
      setDone(false);
      setError("");
      setActiveImg(0);
      setForm({ name: "", email: "", phone: "", moveIn: "", occupants: "", message: "" });
    }, [property?.id]);
    if (!property) return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { paddingTop: 140, textAlign: "center", minHeight: "80vh" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: "fas fa-house-circle-exclamation", style: { fontSize: 48, color: C.stone, display: "block", marginBottom: 20 } }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { fontFamily: F.serif, fontSize: 22, color: C.text, marginBottom: 16 }, children: "Property not found." }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("button", { className: "btn-primary", onClick: () => navigate("Rentals"), style: { padding: "11px 24px" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: "fas fa-arrow-left", style: { marginRight: 8 } }),
        "Back to Rentals"
      ] })
    ] });
    const fallback = PROPERTY_IMAGES[property.property_type] || PROPERTY_IMAGES["default"];
    const mainImg = property.image_url || fallback;
    const gallery = [mainImg, ...(property.gallery_images || []).filter(Boolean)];
    const emailOk = (e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e.trim());
    const submit = async () => {
      setError("");
      if (!form.name.trim()) {
        setError("Please enter your full name.");
        return;
      }
      if (!form.email.trim()) {
        setError("Please enter your email address.");
        return;
      }
      if (!emailOk(form.email)) {
        setError("Please enter a valid email address.");
        return;
      }
      setSubmitting(true);
      try {
        await api.inquiries.create({
          property_id: property.id,
          property_title: property.title,
          full_name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          desired_move_in_date: form.moveIn,
          number_of_occupants: form.occupants,
          message: form.message.trim()
        });
        setDone(true);
      } catch (e) {
        setError(e.message || "Something went wrong. Please try again.");
      } finally {
        setSubmitting(false);
      }
    };
    const amenityIcon = (a) => {
      const lower = a.toLowerCase();
      if (lower.includes("laundry") || lower.includes("washer")) return "fa-shirt";
      if (lower.includes("parking") || lower.includes("garage")) return "fa-car";
      if (lower.includes("air") || lower.includes("hvac")) return "fa-snowflake";
      if (lower.includes("pet")) return "fa-paw";
      if (lower.includes("kitchen")) return "fa-utensils";
      if (lower.includes("yard") || lower.includes("backyard") || lower.includes("garden")) return "fa-leaf";
      if (lower.includes("security")) return "fa-shield-halved";
      if (lower.includes("storage")) return "fa-box";
      if (lower.includes("basement")) return "fa-layer-group";
      if (lower.includes("fireplace")) return "fa-fire";
      if (lower.includes("hardwood") || lower.includes("floor")) return "fa-border-all";
      return "fa-circle-check";
    };
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { paddingTop: 68, background: C.ivory, minHeight: "100vh" }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { maxWidth: 1240, margin: "0 auto", padding: "36px 28px 100px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("button", { onClick: () => navigate("Rentals"), style: {
        background: "none",
        border: "none",
        color: C.muted,
        fontSize: 13,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 28,
        padding: "8px 0"
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: "fas fa-arrow-left", style: { fontSize: 12 } }),
        "Back to Rentals"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 380px", gap: 48, alignItems: "start" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { borderRadius: 16, overflow: "hidden", marginBottom: 12, position: "relative" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              "img",
              {
                src: gallery[activeImg] || mainImg,
                alt: property.title,
                onError: (e) => {
                  e.target.src = fallback;
                },
                style: { width: "100%", height: 440, objectFit: "cover", display: "block" }
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { position: "absolute", top: 16, right: 16 }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(StatusBadge, { status: property.availability_status }) })
          ] }),
          gallery.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { display: "flex", gap: 8, marginBottom: 28 }, children: gallery.map((img, i) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { onClick: () => setActiveImg(i), style: {
            width: 72,
            height: 52,
            borderRadius: 8,
            overflow: "hidden",
            cursor: "pointer",
            border: `2px solid ${activeImg === i ? C.gold : C.stone}`,
            transition: "border-color 0.2s",
            flexShrink: 0
          }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "img",
            {
              src: img,
              alt: `${property.title} ${i + 1}`,
              onError: (e) => {
                e.target.src = fallback;
              },
              style: { width: "100%", height: "100%", objectFit: "cover", display: "block" }
            }
          ) }, i)) }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { background: "#FFF", border: `1px solid ${C.stone}`, borderRadius: 16, padding: "30px 28px" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { marginBottom: 6 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h1", { style: { fontFamily: F.serif, fontSize: 36, fontWeight: 400, color: C.text, lineHeight: 1.15, marginBottom: 8 }, children: property.title }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("p", { style: { color: C.muted, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: "fas fa-location-dot", style: { color: C.clay } }),
                property.address_or_area && `${property.address_or_area} \xB7 `,
                property.city,
                ", ",
                property.country
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("p", { style: { fontFamily: F.serif, fontSize: 32, color: C.espresso, margin: "18px 0" }, children: [
              "$",
              property.monthly_rent.toLocaleString(),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 15, fontWeight: 300, color: C.muted, fontFamily: F.sans }, children: "/month" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: {
              display: "flex",
              gap: 0,
              borderTop: `1px solid ${C.stone}`,
              borderBottom: `1px solid ${C.stone}`,
              padding: "16px 0",
              marginBottom: 28
            }, children: [
              { icon: "fa-bed", label: "Bedrooms", val: property.bedrooms },
              { icon: "fa-shower", label: "Bathrooms", val: property.bathrooms },
              { icon: "fa-home", label: "Type", val: property.property_type }
            ].map(({ icon, label, val }, i) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: {
              flex: 1,
              textAlign: "center",
              borderLeft: i > 0 ? `1px solid ${C.stone}` : "none",
              padding: "0 16px"
            }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: `fas ${icon}`, style: { color: C.clay, fontSize: 16, display: "block", marginBottom: 6 } }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { fontSize: 10, color: C.subtle, letterSpacing: "0.12em", marginBottom: 4, fontWeight: 600 }, children: label.toUpperCase() }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { fontFamily: F.serif, fontSize: 18, color: C.text }, children: val })
            ] }, label)) }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { style: { fontFamily: F.serif, fontSize: 22, fontWeight: 400, color: C.text, marginBottom: 12 }, children: "Description" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { color: C.muted, lineHeight: 1.85, marginBottom: 28, fontSize: 15 }, children: property.description }),
            property.amenities.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { style: { fontFamily: F.serif, fontSize: 22, fontWeight: 400, color: C.text, marginBottom: 14 }, children: "Amenities" }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }, children: property.amenities.map((a) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: {
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: C.ivory,
                border: `1px solid ${C.stone}`,
                borderRadius: 8,
                padding: "10px 14px"
              }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: `fas ${amenityIcon(a)}`, style: { color: C.gold, fontSize: 13, flexShrink: 0 } }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 13, color: C.text }, children: a })
              ] }, a)) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { marginTop: 28, paddingTop: 24, borderTop: `1px solid ${C.stone}` }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: {
              background: C.sand,
              borderRadius: 10,
              padding: "16px 18px",
              display: "flex",
              gap: 12,
              alignItems: "flex-start"
            }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: "fas fa-file-contract", style: { color: C.clay, marginTop: 2, flexShrink: 0 } }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 4 }, children: "Lease Information" }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { fontSize: 13, color: C.muted, lineHeight: 1.65 }, children: "Lease terms, deposit requirements, and rental conditions will be provided upon inquiry and reviewed by Erowho Holdings Limited on a case-by-case basis." })
              ] })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { position: "sticky", top: 88 }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { background: "#FFF", border: `1px solid ${C.stone}`, borderRadius: 16, padding: "26px 22px", boxShadow: "0 8px 32px rgba(42,33,27,0.10)" }, children: done ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { textAlign: "center", padding: "24px 0" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: {
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "rgba(200,168,107,0.12)",
            border: "2px solid rgba(200,168,107,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 18px"
          }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: "fas fa-check", style: { color: C.gold, fontSize: 20 } }) }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { style: { fontFamily: F.serif, fontSize: 22, color: C.text, marginBottom: 12 }, children: "Inquiry Received" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { fontSize: 13.5, color: C.muted, lineHeight: 1.78 }, children: "Thank you. Your rental inquiry has been received. Erowho Holdings Limited will review your request and contact you if the property is available and aligned with your rental needs." })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { style: { fontFamily: F.serif, fontSize: 21, fontWeight: 400, color: C.text, marginBottom: 4 }, children: "Inquire About This Rental" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("p", { style: { fontSize: 13, color: C.muted, marginBottom: 18, display: "flex", alignItems: "center", gap: 6 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: "fas fa-home", style: { color: C.clay, fontSize: 11 } }),
            property.title
          ] }),
          error && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { marginBottom: 14 }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ErrorMsg, { msg: error }) }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { className: "inp", placeholder: "Full name *", value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }) }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { className: "inp", type: "email", placeholder: "Email address *", value: form.email, onChange: (e) => setForm({ ...form, email: e.target.value }) }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { className: "inp", placeholder: "Phone number", value: form.phone, onChange: (e) => setForm({ ...form, phone: e.target.value }) }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("label", { style: { fontSize: 11, color: C.subtle, display: "block", marginBottom: 4, letterSpacing: "0.08em" }, children: "DESIRED MOVE-IN DATE" }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { className: "inp", type: "date", value: form.moveIn, onChange: (e) => setForm({ ...form, moveIn: e.target.value }) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { className: "inp", placeholder: "Number of occupants", value: form.occupants, onChange: (e) => setForm({ ...form, occupants: e.target.value }) }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("textarea", { className: "inp", placeholder: "Message (optional)", value: form.message, onChange: (e) => setForm({ ...form, message: e.target.value }), rows: 3, style: { resize: "vertical" } }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: "btn-primary", onClick: submit, disabled: submitting, style: {
              padding: "13px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8
            }, children: submitting ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Spinner, { size: 16, color: C.espresso }),
              " Submitting\u2026"
            ] }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: "fas fa-paper-plane" }),
              " Submit Inquiry"
            ] }) })
          ] })
        ] }) }) })
      ] })
    ] }) });
  }
  function AboutPage() {
    const sections = [
      {
        icon: "fa-building-columns",
        title: "Who We Are",
        copy: "Erowho Holdings Limited is a real estate investment and holding company focused on rental property ownership across Canada and the United States. We acquire, own, improve, and manage income-producing rental properties with a long-term view.\n\nOur goal is to build a stable rental portfolio while providing quality housing opportunities through properties owned, operated, or controlled by Erowho Holdings Limited."
      },
      {
        icon: "fa-city",
        title: "What We Own",
        copy: "Our portfolio consists of single-family rental homes, townhomes, small multifamily properties, and select apartment units. We focus on residential rental assets in markets with strong fundamentals \u2014 places where people want to live, where rental demand is real, and where long-term ownership makes sense."
      },
      {
        icon: "fa-chart-line",
        title: "How We Grow",
        copy: "Growth at Erowho Holdings Limited is deliberate, not opportunistic. We review properties carefully before acquiring them, and we hold them for the long term. We do not buy to flip, and we do not expand simply because capital is available."
      },
      {
        icon: "fa-house-user",
        title: "Our Rental Approach",
        copy: "Tenants are not a transaction. We manage properties with the understanding that stable, well-maintained housing benefits both tenants and the portfolio. We aim to be responsible landlords \u2014 responsive, clear, and consistent."
      },
      {
        icon: "fa-earth-americas",
        title: "Cross-Border Vision",
        copy: "Erowho Holdings Limited operates across Canada and the United States. This cross-border approach allows us to identify the best opportunities across two large rental markets and build a geographically diversified portfolio without losing operational discipline."
      }
    ];
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { paddingTop: 68 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("section", { style: {
        background: `linear-gradient(160deg, ${C.charcoal} 0%, ${C.espresso} 100%)`,
        padding: "80px 28px 64px",
        position: "relative",
        overflow: "hidden"
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: {
          position: "absolute",
          right: -60,
          top: -60,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,168,107,0.08) 0%, transparent 70%)",
          pointerEvents: "none"
        } }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Label, { light: true, children: "About" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h1", { style: { fontFamily: F.serif, fontSize: 52, fontWeight: 300, color: "#FAF6F0", lineHeight: 1.1, marginBottom: 22 }, children: "About Erowho Holdings Limited" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: {
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(200,168,107,0.1)",
            border: "1px solid rgba(200,168,107,0.22)",
            borderRadius: 8,
            padding: "11px 16px"
          }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: "fas fa-circle-info", style: { color: C.gold } }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { fontSize: 13, color: "rgba(200,168,107,0.9)" }, children: "We are not a brokerage, agent platform, or public rental marketplace. We do not list third-party properties." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { background: C.ivory }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { maxWidth: 780, margin: "0 auto", padding: "68px 28px 100px" }, children: sections.map(({ icon, title, copy }, idx) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { marginBottom: 52, paddingBottom: 52, borderBottom: idx < sections.length - 1 ? `1px solid ${C.stone}` : "none" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: {
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: "rgba(200,168,107,0.1)",
            border: "1px solid rgba(200,168,107,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: `fas ${icon}`, style: { color: C.gold, fontSize: 16 } }) }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { style: { fontFamily: F.serif, fontSize: 30, fontWeight: 300, color: C.text }, children: title })
        ] }),
        copy.split("\n\n").map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { color: C.muted, lineHeight: 1.88, fontSize: 15.5, marginBottom: 12 }, children: p }, i))
      ] }, title)) }) })
    ] });
  }
  function PortfolioPage() {
    const [properties, setProperties] = (0, import_react3.useState)([]);
    const [loading, setLoading] = (0, import_react3.useState)(true);
    (0, import_react3.useEffect)(() => {
      api.properties.list().then((ps) => {
        setProperties(ps);
        setLoading(false);
      }).catch(() => setLoading(false));
    }, []);
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { paddingTop: 68 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("section", { style: {
        background: `linear-gradient(160deg, ${C.charcoal} 0%, ${C.espresso} 100%)`,
        padding: "80px 28px 64px"
      }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { maxWidth: 1240, margin: "0 auto" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Label, { light: true, children: "EROWHO HOLDINGS" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h1", { style: { fontFamily: F.serif, fontSize: 50, fontWeight: 300, color: "#FAF6F0", marginBottom: 14 }, children: "Our Portfolio" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { color: "rgba(215,199,181,0.65)", maxWidth: 540, lineHeight: 1.78, fontSize: 15 }, children: "As Erowho Holdings Limited grows, this page showcases rental assets held within our long-term portfolio across Canada and the United States." })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { background: C.ivory, padding: "56px 28px 100px" }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { maxWidth: 1240, margin: "0 auto" }, children: loading ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(PageLoader, {}) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 22 }, children: properties.map((p) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { background: "#FFF", border: `1px solid ${C.stone}`, borderRadius: 14, overflow: "hidden" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { height: 190, overflow: "hidden", position: "relative" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(PropImage, { property: p, height: 190 }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { position: "absolute", top: 12, right: 12 }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(StatusBadge, { status: p.availability_status }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { padding: "18px 20px" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { style: { fontFamily: F.serif, fontSize: 19, fontWeight: 500, color: C.text, marginBottom: 6 }, children: p.title }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("p", { style: { fontSize: 13, color: C.muted, marginBottom: 12, display: "flex", alignItems: "center", gap: 5 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: "fas fa-location-dot", style: { color: C.clay, fontSize: 11 } }),
            p.city,
            ", ",
            p.country
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }, children: [
            { icon: "fa-home", label: p.property_type },
            { icon: "fa-bed", label: `${p.bedrooms} bed` },
            { icon: "fa-shower", label: `${p.bathrooms} bath` }
          ].map(({ icon, label }) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { style: {
            fontSize: 11.5,
            color: C.muted,
            background: C.ivory,
            padding: "3px 10px",
            borderRadius: 20,
            border: `1px solid ${C.stone}`,
            display: "flex",
            alignItems: "center",
            gap: 5
          }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: `fas ${icon}`, style: { fontSize: 9, color: C.clay } }),
            label
          ] }, label)) }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { paddingTop: 12, borderTop: `1px solid ${C.stone}` }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { fontSize: 10, color: C.clay, letterSpacing: "0.12em", fontWeight: 600 }, children: "OWNED BY EROWHO HOLDINGS" }) })
        ] })
      ] }, p.id)) }) }) })
    ] });
  }
  function ProcessPage() {
    const steps = [
      { icon: "fa-magnifying-glass-location", n: "01", title: "Identify Markets", desc: "We research Canadian and U.S. rental markets where demand, fundamentals, and long-term ownership conditions align." },
      { icon: "fa-file-magnifying-glass", n: "02", title: "Review Property Fundamentals", desc: "We assess each potential acquisition against our Property Review Lens \u2014 evaluating rental demand, condition, cash flow, and long-term suitability." },
      { icon: "fa-file-signature", n: "03", title: "Acquire Rental Assets", desc: "We acquire properties that meet our criteria. We do not move quickly simply because a property is available." },
      { icon: "fa-screwdriver-wrench", n: "04", title: "Prepare or Improve", desc: "Before listing, we ensure the property is in suitable condition. Where improvements are warranted, we make them." },
      { icon: "fa-list-check", n: "05", title: "List for Rent", desc: "Once ready, the property is listed and made available to prospective tenants who inquire directly through Erowho Holdings Limited." },
      { icon: "fa-people-roof", n: "06", title: "Manage Responsibly", desc: "We manage properties with care \u2014 handling maintenance, communications, and tenancy in a straightforward, professional manner." },
      { icon: "fa-clock-rotate-left", n: "07", title: "Hold for the Long Term", desc: "We do not exit positions opportunistically. Our model is built around long-term ownership, stable income, and durable portfolio growth." }
    ];
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { paddingTop: 68 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("section", { style: {
        background: `linear-gradient(160deg, ${C.charcoal} 0%, ${C.espresso} 100%)`,
        padding: "80px 28px 64px"
      }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { maxWidth: 800, margin: "0 auto" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Label, { light: true, children: "How We Operate" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h1", { style: { fontFamily: F.serif, fontSize: 50, fontWeight: 300, color: "#FAF6F0", marginBottom: 14 }, children: "Our Process" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { color: "rgba(215,199,181,0.65)", fontSize: 15, lineHeight: 1.78 }, children: "From identifying a market to holding a property long-term \u2014 here is how Erowho Holdings Limited approaches rental property ownership." })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { background: C.ivory, padding: "68px 28px 100px" }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { maxWidth: 740, margin: "0 auto" }, children: steps.map(({ icon, n, title, desc }, i) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: {
        display: "flex",
        gap: 28,
        marginBottom: 44,
        paddingBottom: 44,
        borderBottom: i < steps.length - 1 ? `1px solid ${C.stone}` : "none"
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: {
          flexShrink: 0,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#FFF",
          border: `2px solid ${C.stone}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative"
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: `fas ${icon}`, style: { color: C.gold, fontSize: 18 } }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: {
            position: "absolute",
            top: -8,
            right: -8,
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: C.gold,
            color: C.espresso,
            fontSize: 9,
            fontFamily: F.mono,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }, children: n })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { style: { fontFamily: F.serif, fontSize: 26, fontWeight: 300, color: C.text, marginBottom: 10 }, children: title }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { color: C.muted, lineHeight: 1.88, fontSize: 15 }, children: desc })
        ] })
      ] }, n)) }) })
    ] });
  }
  function ContactPage() {
    const [form, setForm] = (0, import_react3.useState)({ name: "", email: "", phone: "", type: "", message: "" });
    const [submitting, setSubmitting] = (0, import_react3.useState)(false);
    const [done, setDone] = (0, import_react3.useState)(false);
    const [error, setError] = (0, import_react3.useState)("");
    const emailOk = (e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e.trim());
    const submit = async () => {
      setError("");
      if (!form.name.trim()) {
        setError("Please enter your full name.");
        return;
      }
      if (!form.email.trim()) {
        setError("Please enter your email address.");
        return;
      }
      if (!emailOk(form.email)) {
        setError("Please enter a valid email address.");
        return;
      }
      if (!form.message.trim()) {
        setError("Please enter a message.");
        return;
      }
      setSubmitting(true);
      try {
        await api.contact({
          full_name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || void 0,
          inquiry_type: form.type || void 0,
          message: form.message.trim()
        });
        setDone(true);
      } catch (e) {
        setError(e.message || "Something went wrong. Please try again.");
      } finally {
        setSubmitting(false);
      }
    };
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { paddingTop: 68 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("section", { style: {
        background: `linear-gradient(160deg, ${C.charcoal} 0%, ${C.espresso} 100%)`,
        padding: "80px 28px 64px"
      }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { maxWidth: 700, margin: "0 auto" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Label, { light: true, children: "Get in Touch" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h1", { style: { fontFamily: F.serif, fontSize: 50, fontWeight: 300, color: "#FAF6F0", marginBottom: 10 }, children: "Contact Erowho Holdings Limited" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { color: "rgba(215,199,181,0.65)", fontSize: 15 }, children: "Canada & United States operations" })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { background: C.ivory, padding: "68px 28px 100px" }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { maxWidth: 580, margin: "0 auto" }, children: done ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { textAlign: "center", padding: "60px 0" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: {
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "rgba(200,168,107,0.12)",
          border: "2px solid rgba(200,168,107,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px"
        }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: "fas fa-check", style: { color: C.gold, fontSize: 22 } }) }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { style: { fontFamily: F.serif, fontSize: 30, color: C.text, marginBottom: 14 }, children: "Message Received" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { color: C.muted, lineHeight: 1.78, fontSize: 15 }, children: "Thank you for reaching out to Erowho Holdings Limited. We will review your inquiry and respond accordingly." })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { background: "#FFF", border: `1px solid ${C.stone}`, borderRadius: 16, padding: "36px 32px", boxShadow: "0 4px 24px rgba(42,33,27,0.07)" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { style: { fontFamily: F.serif, fontSize: 26, fontWeight: 300, color: C.text, marginBottom: 22 }, children: "Send a Message" }),
        error && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ErrorMsg, { msg: error }) }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 12 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { className: "inp", placeholder: "Full name *", value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }) }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { className: "inp", type: "email", placeholder: "Email address *", value: form.email, onChange: (e) => setForm({ ...form, email: e.target.value }) }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("input", { className: "inp", placeholder: "Phone (optional)", value: form.phone, onChange: (e) => setForm({ ...form, phone: e.target.value }) }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("select", { className: "inp", value: form.type, onChange: (e) => setForm({ ...form, type: e.target.value }), style: { cursor: "pointer" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "", children: "Inquiry type" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { children: "Rental inquiry" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { children: "General question" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { children: "Portfolio / company inquiry" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { children: "Other" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("textarea", { className: "inp", placeholder: "Message *", value: form.message, onChange: (e) => setForm({ ...form, message: e.target.value }), rows: 5, style: { resize: "vertical" } }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { className: "btn-primary", onClick: submit, disabled: submitting, style: {
            padding: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8
          }, children: submitting ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Spinner, { size: 16, color: C.espresso }),
            " Sending\u2026"
          ] }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("i", { className: "fas fa-paper-plane" }),
            " Send Message"
          ] }) })
        ] })
      ] }) }) })
    ] });
  }

  // src/pages/admin.tsx
  var import_react4 = __toESM(require_react());
  var import_jsx_runtime4 = __toESM(require_jsx_runtime());
  function ToastStack({ toasts, dismiss }) {
    if (!toasts.length) return null;
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10, pointerEvents: "none" }, children: toasts.map((t) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: {
      background: t.type === "success" ? "#2a5c3a" : "#7a2020",
      color: "#fff",
      padding: "12px 16px 12px 14px",
      borderRadius: 10,
      fontSize: 13.5,
      display: "flex",
      alignItems: "center",
      gap: 10,
      boxShadow: "0 4px 24px rgba(0,0,0,0.22)",
      minWidth: 240,
      maxWidth: 360,
      pointerEvents: "all"
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: `fas ${t.type === "success" ? "fa-circle-check" : "fa-triangle-exclamation"}`, style: { flexShrink: 0 } }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: { flex: 1, lineHeight: 1.4 }, children: t.msg }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { onClick: () => dismiss(t.id), style: { background: "none", border: "none", color: "rgba(255,255,255,0.65)", cursor: "pointer", padding: 0, fontSize: 14, flexShrink: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: "fas fa-xmark" }) })
    ] }, t.id)) });
  }
  function ConfirmModal({ title, msg, onConfirm, onCancel }) {
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: {
      position: "fixed",
      inset: 0,
      zIndex: 9e3,
      background: "rgba(30,10,2,0.55)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24
    }, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { background: "#fff", borderRadius: 16, padding: "32px 28px", maxWidth: 440, width: "100%", boxShadow: "0 16px 56px rgba(0,0,0,0.26)" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h3", { style: { fontFamily: F.serif, fontSize: 21, fontWeight: 400, color: C.text, marginBottom: 12 }, children: title }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { style: { fontSize: 14.5, color: C.muted, lineHeight: 1.72, marginBottom: 28 }, children: msg }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { onClick: onCancel, style: { background: "none", border: `1px solid ${C.stone}`, color: C.text, padding: "10px 22px", borderRadius: 8, fontSize: 13.5, cursor: "pointer" }, children: "Cancel" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { onClick: onConfirm, style: { background: "#b91c1c", border: "none", color: "#fff", padding: "10px 22px", borderRadius: 8, fontSize: 13.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: "fas fa-trash", style: { fontSize: 11 } }),
          "Delete"
        ] })
      ] })
    ] }) });
  }
  function downloadCsv(filename, rows, cols) {
    const header = cols.map((c) => JSON.stringify(c.label)).join(",");
    const body = rows.map(
      (row) => cols.map((c) => {
        const v = row[c.key];
        return JSON.stringify(Array.isArray(v) ? v.join("; ") : v ?? "");
      }).join(",")
    ).join("\n");
    const blob = new Blob([header + "\n" + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
  function useWindowWidth() {
    const [w, setW] = (0, import_react4.useState)(typeof window !== "undefined" ? window.innerWidth : 1200);
    (0, import_react4.useEffect)(() => {
      const h = () => setW(window.innerWidth);
      window.addEventListener("resize", h);
      return () => window.removeEventListener("resize", h);
    }, []);
    return w;
  }
  function AdminLoginPage({
    navigate,
    onLogin
  }) {
    const [username, setUsername] = (0, import_react4.useState)("admin");
    const [password, setPassword] = (0, import_react4.useState)("");
    const [loading, setLoading] = (0, import_react4.useState)(false);
    const [error, setError] = (0, import_react4.useState)("");
    const submit = async () => {
      if (!password) {
        setError("Password is required.");
        return;
      }
      setLoading(true);
      setError("");
      try {
        const { token } = await api.auth.login(username, password);
        api.saveToken(token);
        onLogin();
        navigate("AdminDashboard");
      } catch (e) {
        setError(e.message || "Invalid credentials.");
      } finally {
        setLoading(false);
      }
    };
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { minHeight: "100vh", background: C.espresso, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { background: C.charcoal, border: "1px solid rgba(90,78,68,0.6)", borderRadius: 16, padding: "48px 40px", width: "100%", maxWidth: 380 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { textAlign: "center", marginBottom: 36 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { style: { fontFamily: F.serif, fontSize: 22, color: "#FAF6F0", marginBottom: 4 }, children: "Erowho Holdings Limited" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { style: { fontSize: 9.5, color: C.clay, letterSpacing: "0.24em" }, children: "ADMIN ACCESS" })
      ] }),
      error && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { marginBottom: 16 }, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(ErrorMsg, { msg: error }) }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { className: "inp inp-dark", value: username, onChange: (e) => setUsername(e.target.value), placeholder: "Username" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { className: "inp inp-dark", type: "password", value: password, onChange: (e) => setPassword(e.target.value), onKeyDown: (e) => e.key === "Enter" && submit(), placeholder: "Password" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "button",
          {
            className: "btn-brass",
            onClick: submit,
            disabled: loading,
            style: { padding: "13px", borderRadius: 8, fontSize: 14, marginTop: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
            children: loading ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Spinner, { size: 16, color: C.espresso }),
              " Signing in\u2026"
            ] }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: "fas fa-right-to-bracket" }),
              " Sign In"
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { style: { fontSize: 11, color: "rgba(215,199,181,0.3)", textAlign: "center", marginTop: 22 }, children: "Default: admin / admin123" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { onClick: () => navigate("Home"), style: { background: "none", border: "none", color: "rgba(215,199,181,0.35)", fontSize: 12, cursor: "pointer", display: "block", margin: "16px auto 0", textDecoration: "underline" }, children: "\u2190 Back to website" })
    ] }) });
  }
  function AdminShell({ title, navigate, children, onLogout }) {
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { minHeight: "100vh", background: "#F7F1E8" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: {
        background: C.espresso,
        borderBottom: "1px solid rgba(90,78,68,0.4)",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 58,
        position: "sticky",
        top: 0,
        zIndex: 100
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 18 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: { fontFamily: F.serif, fontSize: 18, color: "#FAF6F0", cursor: "pointer" }, onClick: () => navigate("AdminDashboard"), children: "Erowho Admin" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: { fontSize: 12, color: "rgba(215,199,181,0.3)" }, children: "|" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: { fontSize: 13, color: C.clay }, children: title })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", gap: 10, alignItems: "center" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { onClick: () => navigate("Home"), style: { background: "none", border: "none", color: "rgba(215,199,181,0.5)", fontSize: 12, cursor: "pointer" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: "fas fa-arrow-up-right-from-square", style: { marginRight: 5 } }),
            "View site"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { className: "btn-outline-dark", onClick: onLogout, style: { padding: "6px 14px", borderRadius: 6, fontSize: 12 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: "fas fa-right-from-bracket", style: { marginRight: 6 } }),
            "Sign Out"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { padding: "30px 28px 60px", maxWidth: 1160, margin: "0 auto" }, children })
    ] });
  }
  function AdminDashboard({
    navigate,
    onLogout,
    setEditTarget
  }) {
    const [tab, setTab] = (0, import_react4.useState)("properties");
    const [properties, setProperties] = (0, import_react4.useState)([]);
    const [inquiries, setInquiries] = (0, import_react4.useState)([]);
    const [stats, setStats] = (0, import_react4.useState)(null);
    const [loading, setLoading] = (0, import_react4.useState)(true);
    const [error, setError] = (0, import_react4.useState)("");
    const [toasts, setToasts] = (0, import_react4.useState)([]);
    const nextId = (0, import_react4.useRef)(0);
    const addToast = (0, import_react4.useCallback)((msg, type = "success") => {
      const id = ++nextId.current;
      setToasts((prev) => [...prev, { id, msg, type }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
    }, []);
    const [pendingDelete, setPendingDelete] = (0, import_react4.useState)(null);
    const [pSearch, setPSearch] = (0, import_react4.useState)("");
    const [pStatus, setPStatus] = (0, import_react4.useState)("");
    const [pPublished, setPPublished] = (0, import_react4.useState)("");
    const [pCountry, setPCountry] = (0, import_react4.useState)("");
    const [pType, setPType] = (0, import_react4.useState)("");
    const [iStatus, setIStatus] = (0, import_react4.useState)("");
    const [iProp, setIProp] = (0, import_react4.useState)("");
    const [noteEdits, setNoteEdits] = (0, import_react4.useState)({});
    const windowWidth = useWindowWidth();
    const isMobile = windowWidth < 768;
    const statCols = windowWidth < 600 ? "repeat(3, 1fr)" : "repeat(6, 1fr)";
    const load = async () => {
      setLoading(true);
      try {
        const [ps, inqs, st] = await Promise.all([
          api.admin.listProperties(),
          api.admin.listInquiries(),
          api.admin.getStats()
        ]);
        setProperties(ps);
        setInquiries(inqs);
        setStats(st);
        const notes = {};
        inqs.forEach((inq) => {
          notes[inq.id] = inq.admin_notes || "";
        });
        setNoteEdits(notes);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    (0, import_react4.useEffect)(() => {
      load();
    }, []);
    const filteredProperties = properties.filter((p) => {
      const q = pSearch.toLowerCase();
      if (q && !p.title.toLowerCase().includes(q) && !p.city.toLowerCase().includes(q)) return false;
      if (pStatus && p.availability_status !== pStatus) return false;
      if (pPublished === "published" && !p.is_published) return false;
      if (pPublished === "draft" && p.is_published) return false;
      if (pCountry && p.country !== pCountry) return false;
      if (pType && p.property_type !== pType) return false;
      return true;
    });
    const filteredInquiries = inquiries.filter((inq) => {
      if (iStatus && inq.status !== iStatus) return false;
      if (iProp && !(inq.property_title || "").toLowerCase().includes(iProp.toLowerCase())) return false;
      return true;
    });
    const countries = [...new Set(properties.map((p) => p.country))].sort();
    const propTypes = [...new Set(properties.map((p) => p.property_type))].sort();
    const hasPropertyFilters = !!(pSearch || pStatus || pPublished || pCountry || pType);
    const hasInquiryFilters = !!(iStatus || iProp);
    const doDelete = async (id) => {
      try {
        await api.admin.deleteProperty(id);
        setProperties((prev) => prev.filter((p) => p.id !== id));
        addToast("Property deleted.");
      } catch (e) {
        addToast(e.message, "error");
      } finally {
        setPendingDelete(null);
      }
    };
    const togglePub = async (id) => {
      try {
        const updated = await api.admin.togglePublish(id);
        setProperties((prev) => prev.map((p) => p.id === id ? updated : p));
        addToast(updated.is_published ? "Property published." : "Property moved to draft.");
      } catch (e) {
        addToast(e.message, "error");
      }
    };
    const toggleFeature = async (id) => {
      try {
        const updated = await api.admin.featureProperty(id);
        setProperties((prev) => prev.map((p) => p.id === id ? updated : p));
        addToast(updated.is_featured ? "Marked as featured \u2014 shows on homepage." : "Removed from featured.");
      } catch (e) {
        addToast(e.message, "error");
      }
    };
    const updateInquiry = async (id, data) => {
      try {
        await api.admin.updateInquiry(id, data);
        setInquiries((prev) => prev.map((inq) => inq.id === id ? { ...inq, ...data } : inq));
        if ("status" in data) addToast(`Inquiry marked as ${data.status}.`);
        else addToast("Note saved.");
      } catch (e) {
        addToast(e.message, "error");
      }
    };
    const jumpToProperties = (filters) => {
      setTab("properties");
      setPSearch("");
      setPCountry("");
      setPType("");
      setPStatus(filters.pStatus || "");
      setPPublished(filters.pPublished || "");
    };
    const jumpToInquiries = (status) => {
      setTab("inquiries");
      setIProp("");
      setIStatus(status || "");
    };
    const fInp = {
      background: C.cream,
      border: `1px solid ${C.stone}`,
      color: C.text,
      padding: "7px 10px",
      borderRadius: 7,
      fontSize: 12.5,
      outline: "none"
    };
    const fSel = { ...fInp, cursor: "pointer" };
    const TabBtn = ({ t, label }) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { onClick: () => setTab(t), style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: tab === t ? C.espresso : C.muted,
      fontSize: 14,
      padding: "10px 0",
      borderBottom: `2px solid ${tab === t ? C.gold : "transparent"}`,
      marginRight: 28,
      fontWeight: tab === t ? 600 : 400,
      letterSpacing: "0.02em"
    }, children: label });
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(AdminShell, { title: "Dashboard", navigate, onLogout, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(ToastStack, { toasts, dismiss: (id) => setToasts((prev) => prev.filter((t) => t.id !== id)) }),
      pendingDelete && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        ConfirmModal,
        {
          title: "Delete property?",
          msg: `Are you sure you want to delete "${pendingDelete.title}"? This action cannot be undone.`,
          onConfirm: () => doDelete(pendingDelete.id),
          onCancel: () => setPendingDelete(null)
        }
      ),
      stats && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { display: "grid", gridTemplateColumns: statCols, gap: 14, marginBottom: 32 }, children: [
        { label: "Total", val: stats.total_properties, icon: "fa-building", action: () => jumpToProperties({}) },
        { label: "Published", val: stats.published, icon: "fa-eye", action: () => jumpToProperties({ pPublished: "published" }) },
        { label: "Available", val: stats.available, icon: "fa-circle-check", action: () => jumpToProperties({ pStatus: "Available", pPublished: "published" }) },
        { label: "Rented", val: stats.rented, icon: "fa-house-user", action: () => jumpToProperties({ pStatus: "Rented" }) },
        { label: "Inquiries", val: stats.total_inquiries, icon: "fa-envelope", action: () => jumpToInquiries() },
        { label: "New", val: stats.new_inquiries, icon: "fa-bell", action: () => jumpToInquiries("New") }
      ].map(({ label, val, icon, action }) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
        "div",
        {
          onClick: action,
          title: `Click to filter by ${label}`,
          style: { background: "#FFF", border: `1px solid ${C.stone}`, borderRadius: 10, padding: "14px 16px", cursor: "pointer" },
          onMouseEnter: (e) => {
            const el = e.currentTarget;
            el.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)";
            el.style.borderColor = C.clay;
          },
          onMouseLeave: (e) => {
            const el = e.currentTarget;
            el.style.boxShadow = "none";
            el.style.borderColor = C.stone;
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: `fas ${icon}`, style: { fontSize: 12, color: C.clay } }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { style: { fontSize: 9.5, color: C.subtle, letterSpacing: "0.1em", fontWeight: 600 }, children: label.toUpperCase() })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { style: { fontSize: 24, color: C.espresso, fontFamily: F.mono }, children: val })
          ]
        },
        label
      )) }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(TabBtn, { t: "properties", label: `Properties (${properties.length})` }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(TabBtn, { t: "inquiries", label: `Inquiries (${inquiries.length})` })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", gap: 8 }, children: [
          tab === "properties" && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
              "button",
              {
                onClick: () => downloadCsv("erowho-properties.csv", filteredProperties, [
                  { key: "title", label: "Title" },
                  { key: "city", label: "City" },
                  { key: "country", label: "Country" },
                  { key: "property_type", label: "Type" },
                  { key: "bedrooms", label: "Beds" },
                  { key: "bathrooms", label: "Baths" },
                  { key: "monthly_rent", label: "Rent/mo ($)" },
                  { key: "availability_status", label: "Status" },
                  { key: "is_published", label: "Published" },
                  { key: "is_featured", label: "Featured" },
                  { key: "created_at", label: "Created" }
                ]),
                style: { background: "none", border: `1px solid ${C.stone}`, color: C.muted, padding: "7px 13px", borderRadius: 7, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: "fas fa-file-csv", style: { fontSize: 10 } }),
                  "Export CSV"
                ]
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
              "button",
              {
                className: "btn-brass",
                onClick: () => {
                  setEditTarget(null);
                  navigate("AdminAddProperty");
                },
                style: { padding: "9px 18px", borderRadius: 8, fontSize: 13, display: "flex", alignItems: "center", gap: 7 },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: "fas fa-plus" }),
                  "Add Property"
                ]
              }
            )
          ] }),
          tab === "inquiries" && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
            "button",
            {
              onClick: () => downloadCsv("erowho-inquiries.csv", filteredInquiries, [
                { key: "full_name", label: "Name" },
                { key: "email", label: "Email" },
                { key: "phone", label: "Phone" },
                { key: "property_title", label: "Property" },
                { key: "desired_move_in_date", label: "Desired Move-in" },
                { key: "number_of_occupants", label: "Occupants" },
                { key: "message", label: "Message" },
                { key: "status", label: "Status" },
                { key: "admin_notes", label: "Admin Notes" },
                { key: "created_at", label: "Submitted" }
              ]),
              style: { background: "none", border: `1px solid ${C.stone}`, color: C.muted, padding: "7px 13px", borderRadius: 7, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: "fas fa-file-csv", style: { fontSize: 10 } }),
                "Export CSV"
              ]
            }
          )
        ] })
      ] }),
      error && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { marginBottom: 18 }, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(ErrorMsg, { msg: error }) }),
      tab === "properties" && !loading && properties.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 16, padding: "12px 14px", background: "#fff", border: `1px solid ${C.stone}`, borderRadius: 10 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { value: pSearch, onChange: (e) => setPSearch(e.target.value), placeholder: "Search name or city\u2026", style: { ...fInp, minWidth: 180 } }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("select", { value: pStatus, onChange: (e) => setPStatus(e.target.value), style: fSel, children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "", children: "All statuses" }),
          ["Available", "Coming Soon", "Rented", "Under Review"].map((s) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { children: s }, s))
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("select", { value: pPublished, onChange: (e) => setPPublished(e.target.value), style: fSel, children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "", children: "Published + Draft" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "published", children: "Published only" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "draft", children: "Draft only" })
        ] }),
        countries.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("select", { value: pCountry, onChange: (e) => setPCountry(e.target.value), style: fSel, children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "", children: "All countries" }),
          countries.map((c) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { children: c }, c))
        ] }),
        propTypes.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("select", { value: pType, onChange: (e) => setPType(e.target.value), style: fSel, children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "", children: "All types" }),
          propTypes.map((t) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { children: t }, t))
        ] }),
        hasPropertyFilters && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
            "button",
            {
              onClick: () => {
                setPSearch("");
                setPStatus("");
                setPPublished("");
                setPCountry("");
                setPType("");
              },
              style: { background: "none", border: "none", color: C.clay, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, padding: "4px 2px" },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: "fas fa-xmark" }),
                "Reset"
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { style: { fontSize: 11, color: C.subtle }, children: [
            filteredProperties.length,
            " / ",
            properties.length
          ] })
        ] })
      ] }),
      tab === "inquiries" && !loading && inquiries.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 16, padding: "12px 14px", background: "#fff", border: `1px solid ${C.stone}`, borderRadius: 10 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("select", { value: iStatus, onChange: (e) => setIStatus(e.target.value), style: fSel, children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: "", children: "All statuses" }),
          ["New", "Reviewed", "Contacted", "Closed"].map((s) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { children: s }, s))
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { value: iProp, onChange: (e) => setIProp(e.target.value), placeholder: "Filter by property name\u2026", style: { ...fInp, minWidth: 200 } }),
        hasInquiryFilters && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
            "button",
            {
              onClick: () => {
                setIStatus("");
                setIProp("");
              },
              style: { background: "none", border: "none", color: C.clay, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, padding: "4px 2px" },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: "fas fa-xmark" }),
                "Reset"
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { style: { fontSize: 11, color: C.subtle }, children: [
            filteredInquiries.length,
            " / ",
            inquiries.length
          ] })
        ] })
      ] }),
      loading ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PageLoader, {}) : tab === "properties" ? isMobile ? (
        /* Mobile property cards */
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { display: "flex", flexDirection: "column", gap: 12 }, children: filteredProperties.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { textAlign: "center", padding: "44px 28px", color: C.muted }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: "fas fa-home", style: { fontSize: 28, color: C.stone, display: "block", marginBottom: 12 } }),
          hasPropertyFilters ? "No properties match your filters." : /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
            "No properties yet.",
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "btn-brass", onClick: () => navigate("AdminAddProperty"), style: { padding: "6px 14px", borderRadius: 7, fontSize: 12 }, children: "Add one" })
          ] })
        ] }) : filteredProperties.map((p) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { background: "#fff", border: `1px solid ${C.stone}`, borderRadius: 12, padding: 16 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", gap: 12, marginBottom: 12 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { width: 60, height: 46, borderRadius: 8, overflow: "hidden", flexShrink: 0, border: `1px solid ${C.stone}` }, children: p.image_url ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("img", { src: p.image_url, alt: p.title, onError: (e) => {
              e.target.style.display = "none";
            }, style: { width: "100%", height: "100%", objectFit: "cover", display: "block" } }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PropTypeImage, { propertyType: p.property_type, height: 46 }) }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { flex: 1, minWidth: 0 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { style: { fontSize: 14, color: C.text, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: p.title }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("p", { style: { fontSize: 11.5, color: C.muted }, children: [
                p.property_type,
                " \xB7 ",
                p.city,
                ", ",
                p.country
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("p", { style: { fontFamily: F.mono, fontSize: 13, color: C.espresso, marginTop: 2 }, children: [
                "$",
                p.monthly_rent.toLocaleString(),
                "/mo"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(StatusBadge, { status: p.availability_status }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { onClick: () => togglePub(p.id), style: {
              background: p.is_published ? "rgba(200,168,107,0.12)" : C.cream,
              border: `1px solid ${p.is_published ? C.gold : C.stone}`,
              color: p.is_published ? C.gold : C.muted,
              padding: "3px 10px",
              borderRadius: 20,
              fontSize: 11,
              cursor: "pointer",
              fontWeight: 500
            }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: `fas ${p.is_published ? "fa-eye" : "fa-eye-slash"}`, style: { marginRight: 4, fontSize: 9 } }),
              p.is_published ? "Published" : "Draft"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
              "button",
              {
                onClick: () => toggleFeature(p.id),
                title: p.is_featured ? "Remove from featured" : "Feature on homepage",
                style: { background: "none", border: "none", cursor: "pointer", color: p.is_featured ? C.gold : C.stone, fontSize: 18, padding: "2px", lineHeight: 1 },
                children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: `fa${p.is_featured ? "s" : "r"} fa-star` })
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
              "button",
              {
                onClick: () => window.open(`/?p=${p.slug}`, "_blank"),
                style: { background: "none", border: `1px solid ${C.stone}`, color: C.muted, padding: "5px 11px", borderRadius: 6, fontSize: 11.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: "fas fa-arrow-up-right-from-square", style: { fontSize: 9 } }),
                  "Preview"
                ]
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
              "button",
              {
                onClick: () => {
                  setEditTarget(p);
                  navigate("AdminEditProperty");
                },
                style: { background: "none", border: `1px solid ${C.stone}`, color: C.muted, padding: "5px 11px", borderRadius: 6, fontSize: 11.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: "fas fa-pen", style: { fontSize: 9 } }),
                  "Edit"
                ]
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
              "button",
              {
                onClick: () => setPendingDelete({ id: p.id, title: p.title }),
                style: { background: "#b91c1c", border: "none", color: "#fff", padding: "5px 11px", borderRadius: 6, fontSize: 11.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: "fas fa-trash", style: { fontSize: 9 } }),
                  "Delete"
                ]
              }
            )
          ] })
        ] }, p.id)) })
      ) : (
        /* Desktop property table */
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { background: "#FFF", border: `1px solid ${C.stone}`, borderRadius: 12, overflow: "hidden" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("table", { style: { width: "100%", borderCollapse: "collapse" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("tr", { style: { borderBottom: `1px solid ${C.stone}`, background: C.cream }, children: ["Property", "Location", "Rent/mo", "Status", "Published", "Featured", "Actions"].map((h) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("th", { style: { padding: "11px 14px", fontSize: 10, color: C.subtle, letterSpacing: "0.12em", textAlign: "left", fontWeight: 600 }, children: h.toUpperCase() }, h)) }) }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("tbody", { children: filteredProperties.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("tr", { className: "arow", style: { borderBottom: i < filteredProperties.length - 1 ? `1px solid ${C.stone}` : "none" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("td", { style: { padding: "12px 14px" }, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 11 }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { width: 52, height: 40, borderRadius: 7, overflow: "hidden", flexShrink: 0, border: `1px solid ${C.stone}` }, children: p.image_url ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("img", { src: p.image_url, alt: p.title, onError: (e) => {
                  e.target.style.display = "none";
                }, style: { width: "100%", height: "100%", objectFit: "cover", display: "block" } }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PropTypeImage, { propertyType: p.property_type, height: 40 }) }),
                /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { style: { fontSize: 13, color: C.text, fontWeight: 500 }, children: p.title }),
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { style: { fontSize: 11, color: C.muted }, children: p.property_type })
                ] })
              ] }) }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("td", { style: { padding: "12px 14px", fontSize: 12.5, color: C.muted, whiteSpace: "nowrap" }, children: [
                p.city,
                ", ",
                p.country
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("td", { style: { padding: "12px 14px", fontFamily: F.mono, fontSize: 13, color: C.espresso, fontWeight: 500, whiteSpace: "nowrap" }, children: [
                "$",
                p.monthly_rent.toLocaleString()
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("td", { style: { padding: "12px 14px" }, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(StatusBadge, { status: p.availability_status }) }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("td", { style: { padding: "12px 14px" }, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { onClick: () => togglePub(p.id), style: {
                background: p.is_published ? "rgba(200,168,107,0.12)" : C.cream,
                border: `1px solid ${p.is_published ? C.gold : C.stone}`,
                color: p.is_published ? C.gold : C.muted,
                padding: "4px 12px",
                borderRadius: 20,
                fontSize: 11,
                cursor: "pointer",
                fontWeight: 500,
                whiteSpace: "nowrap"
              }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: `fas ${p.is_published ? "fa-eye" : "fa-eye-slash"}`, style: { marginRight: 5, fontSize: 9 } }),
                p.is_published ? "Published" : "Draft"
              ] }) }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("td", { style: { padding: "12px 14px", textAlign: "center" }, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                "button",
                {
                  onClick: () => toggleFeature(p.id),
                  title: p.is_featured ? "Remove from homepage featured" : "Feature on homepage",
                  style: { background: "none", border: "none", cursor: "pointer", color: p.is_featured ? C.gold : C.stone, fontSize: 20, lineHeight: 1, padding: 0 },
                  children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: `fa${p.is_featured ? "s" : "r"} fa-star` })
                }
              ) }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("td", { style: { padding: "12px 14px" }, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", gap: 6 }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
                  "button",
                  {
                    onClick: () => window.open(`/?p=${p.slug}`, "_blank"),
                    title: "Preview in new tab",
                    style: { background: "none", border: `1px solid ${C.stone}`, color: C.muted, padding: "5px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 },
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: "fas fa-arrow-up-right-from-square", style: { fontSize: 10 } }),
                      "Preview"
                    ]
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
                  "button",
                  {
                    onClick: () => {
                      setEditTarget(p);
                      navigate("AdminEditProperty");
                    },
                    style: { background: "none", border: `1px solid ${C.stone}`, color: C.muted, padding: "5px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 },
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: "fas fa-pen", style: { fontSize: 10 } }),
                      "Edit"
                    ]
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
                  "button",
                  {
                    onClick: () => setPendingDelete({ id: p.id, title: p.title }),
                    style: { background: "#b91c1c", border: "none", color: "#fff", padding: "5px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 },
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: "fas fa-trash", style: { fontSize: 10 } }),
                      "Delete"
                    ]
                  }
                )
              ] }) })
            ] }, p.id)) })
          ] }),
          filteredProperties.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { padding: "48px", textAlign: "center", color: C.muted }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: "fas fa-home", style: { fontSize: 32, color: C.stone, display: "block", marginBottom: 14 } }),
            hasPropertyFilters ? "No properties match your filters." : /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
              "No properties yet.",
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "btn-brass", onClick: () => navigate("AdminAddProperty"), style: { padding: "7px 16px", borderRadius: 7, fontSize: 13, marginLeft: 8 }, children: "Add one" })
            ] })
          ] })
        ] })
      ) : (
        /* Inquiries tab */
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { display: "flex", flexDirection: "column", gap: 14 }, children: filteredInquiries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { textAlign: "center", padding: "60px", color: C.muted }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: "fas fa-envelope-open", style: { fontSize: 32, color: C.stone, display: "block", marginBottom: 14 } }),
          hasInquiryFilters ? "No inquiries match your filters." : "No inquiries received yet."
        ] }) : filteredInquiries.map((inq) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { background: "#FFF", border: `1px solid ${C.stone}`, borderRadius: 12, padding: "18px 22px" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 10 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { style: { fontSize: 15.5, color: C.text, fontWeight: 500, marginBottom: 5 }, children: inq.full_name }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", gap: 18, flexWrap: "wrap" }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("a", { href: `mailto:${inq.email}`, style: { fontSize: 13, color: C.espresso, textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: "fas fa-envelope", style: { color: C.clay, fontSize: 10 } }),
                  inq.email
                ] }),
                inq.phone && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("a", { href: `tel:${inq.phone}`, style: { fontSize: 13, color: C.espresso, textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: "fas fa-phone", style: { color: C.clay, fontSize: 10 } }),
                  inq.phone
                ] })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { textAlign: "right" }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { style: { fontSize: 12.5, color: C.terracotta, fontWeight: 500 }, children: inq.property_title || "General inquiry" }),
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { style: { fontSize: 11, color: C.subtle }, children: new Date(inq.created_at).toLocaleDateString() })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                "select",
                {
                  value: inq.status,
                  onChange: (e) => updateInquiry(inq.id, { status: e.target.value }),
                  style: { background: C.cream, border: `1px solid ${C.stone}`, color: C.text, padding: "5px 9px", borderRadius: 6, fontSize: 11.5, cursor: "pointer" },
                  children: ["New", "Reviewed", "Contacted", "Closed"].map((s) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { children: s }, s))
                }
              )
            ] })
          ] }),
          (inq.desired_move_in_date || inq.number_of_occupants) && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", gap: 18, marginBottom: 10, fontSize: 12, color: C.subtle, flexWrap: "wrap" }, children: [
            inq.desired_move_in_date && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: "fas fa-calendar", style: { marginRight: 5, color: C.clay } }),
              "Move-in: ",
              inq.desired_move_in_date
            ] }),
            inq.number_of_occupants && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: "fas fa-people-group", style: { marginRight: 5, color: C.clay } }),
              "Occupants: ",
              inq.number_of_occupants
            ] })
          ] }),
          inq.message && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { style: { fontSize: 13.5, color: C.muted, lineHeight: 1.68, borderTop: `1px solid ${C.stone}`, paddingTop: 12, marginBottom: 12 }, children: inq.message }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { borderTop: `1px solid ${C.stone}`, paddingTop: 12 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { style: { fontSize: 10, color: C.subtle, letterSpacing: "0.1em", marginBottom: 6, fontWeight: 600 }, children: "ADMIN NOTES" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
              "textarea",
              {
                value: noteEdits[inq.id] ?? "",
                onChange: (e) => setNoteEdits((prev) => ({ ...prev, [inq.id]: e.target.value })),
                placeholder: "Add a private note about this inquiry\u2026",
                rows: 2,
                style: { width: "100%", resize: "vertical", background: C.cream, border: `1px solid ${C.stone}`, borderRadius: 7, padding: "8px 10px", fontSize: 12.5, color: C.text, fontFamily: "inherit", boxSizing: "border-box", display: "block", outline: "none" }
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
              "button",
              {
                onClick: () => updateInquiry(inq.id, { admin_notes: noteEdits[inq.id] ?? "" }),
                style: { marginTop: 7, background: "none", border: `1px solid ${C.stone}`, color: C.muted, padding: "5px 14px", borderRadius: 6, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: "fas fa-floppy-disk", style: { fontSize: 10 } }),
                  "Save note"
                ]
              }
            )
          ] })
        ] }, inq.id)) })
      )
    ] });
  }
  function AdminPropertyForm({
    editTarget,
    navigate,
    onLogout
  }) {
    const isEdit = !!editTarget;
    const toStr = (v) => Array.isArray(v) ? v.join(", ") : v || "";
    const toGallery = (v) => Array.isArray(v) ? v.join("\n") : v || "";
    const [form, setForm] = (0, import_react4.useState)({
      title: editTarget?.title || "",
      slug: editTarget?.slug || "",
      country: editTarget?.country || "Canada",
      city: editTarget?.city || "",
      address_or_area: editTarget?.address_or_area || "",
      property_type: editTarget?.property_type || "Single-Family Home",
      bedrooms: String(editTarget?.bedrooms ?? 3),
      bathrooms: String(editTarget?.bathrooms ?? 2),
      monthly_rent: String(editTarget?.monthly_rent ?? 2e3),
      availability_status: editTarget?.availability_status || "Available",
      description: editTarget?.description || "",
      amenities: toStr(editTarget?.amenities),
      image_url: editTarget?.image_url || "",
      gallery_images: toGallery(editTarget?.gallery_images),
      is_published: editTarget?.is_published ?? true,
      is_featured: editTarget?.is_featured ?? false
    });
    const [saving, setSaving] = (0, import_react4.useState)(false);
    const [saved, setSaved] = (0, import_react4.useState)(false);
    const [error, setError] = (0, import_react4.useState)("");
    const up = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
    const save = async () => {
      if (!form.title || !form.city || !form.monthly_rent) {
        setError("Title, city, and monthly rent are required.");
        return;
      }
      setSaving(true);
      setError("");
      try {
        const payload = {
          ...form,
          bedrooms: parseFloat(form.bedrooms) || 1,
          bathrooms: parseFloat(form.bathrooms) || 1,
          monthly_rent: parseInt(form.monthly_rent) || 0,
          amenities: form.amenities.split(",").map((a) => a.trim()).filter(Boolean),
          gallery_images: form.gallery_images.split("\n").map((u) => u.trim()).filter(Boolean),
          slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-")
        };
        if (isEdit) await api.admin.updateProperty(editTarget.id, payload);
        else await api.admin.createProperty(payload);
        setSaved(true);
        setTimeout(() => navigate("AdminDashboard"), 900);
      } catch (e) {
        setError(e.message);
      } finally {
        setSaving(false);
      }
    };
    const Lbl = ({ t }) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("label", { style: { fontSize: 10, color: C.subtle, letterSpacing: "0.12em", display: "block", marginBottom: 5, fontWeight: 600 }, children: t });
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(AdminShell, { title: isEdit ? `Edit: ${editTarget.title}` : "Add Property", navigate, onLogout, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26, flexWrap: "wrap", gap: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { style: { fontFamily: F.serif, fontSize: 26, fontWeight: 300, color: C.text }, children: isEdit ? "Edit Property" : "Add New Property" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", gap: 10 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { onClick: () => navigate("AdminDashboard"), style: { background: "none", border: `1px solid ${C.stone}`, color: C.text, padding: "9px 20px", borderRadius: 8, fontSize: 13, cursor: "pointer" }, children: "Cancel" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
            "button",
            {
              className: "btn-brass",
              onClick: save,
              disabled: saving || saved,
              style: { padding: "9px 24px", display: "flex", alignItems: "center", gap: 7 },
              children: saved ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: "fas fa-check" }),
                " Saved!"
              ] }) : saving ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Spinner, { size: 14, color: C.espresso }),
                " Saving\u2026"
              ] }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: "fas fa-floppy-disk" }),
                " Save Property"
              ] })
            }
          )
        ] })
      ] }),
      form.image_url ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { marginBottom: 24, borderRadius: 12, overflow: "hidden", border: `1px solid ${C.stone}` }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "img",
          {
            src: form.image_url,
            alt: "Property preview",
            onError: (e) => {
              e.target.style.opacity = "0";
            },
            style: { width: "100%", maxHeight: 200, objectFit: "cover", display: "block" }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("p", { style: { padding: "8px 12px", fontSize: 11, color: C.muted, background: C.cream }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: "fas fa-image", style: { marginRight: 6, color: C.clay } }),
          "Main image preview"
        ] })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { marginBottom: 24 }, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PropTypeImage, { propertyType: form.property_type, height: 180, style: { borderRadius: 12 } }) }),
      error && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { marginBottom: 18 }, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(ErrorMsg, { msg: error }) }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { background: "#FFF", border: `1px solid ${C.stone}`, borderRadius: 12, padding: "26px 22px", display: "flex", flexDirection: "column", gap: 16 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h3", { style: { fontFamily: F.serif, fontSize: 18, fontWeight: 400, color: C.text, marginBottom: 4 }, children: "Property Details" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Lbl, { t: "TITLE *" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { className: "inp", value: form.title, onChange: up("title"), placeholder: "Property title" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Lbl, { t: "SLUG (auto-generated if blank)" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { className: "inp", value: form.slug, onChange: up("slug"), placeholder: "url-friendly-name" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Lbl, { t: "COUNTRY *" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("select", { className: "inp", value: form.country, onChange: up("country"), style: { cursor: "pointer" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { children: "Canada" }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { children: "United States" })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Lbl, { t: "CITY *" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { className: "inp", value: form.city, onChange: up("city"), placeholder: "e.g. Toronto" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Lbl, { t: "ADDRESS / AREA" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { className: "inp", value: form.address_or_area, onChange: up("address_or_area"), placeholder: "e.g. Midtown Toronto" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Lbl, { t: "PROPERTY TYPE" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("select", { className: "inp", value: form.property_type, onChange: up("property_type"), style: { cursor: "pointer" }, children: ["Single-Family Home", "Townhome", "Duplex", "Apartment", "Condo", "Multifamily"].map((t) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { children: t }, t)) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Lbl, { t: "AVAILABILITY STATUS" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("select", { className: "inp", value: form.availability_status, onChange: up("availability_status"), style: { cursor: "pointer" }, children: ["Available", "Coming Soon", "Rented", "Under Review"].map((s) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { children: s }, s)) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Lbl, { t: "BEDS" }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { className: "inp", type: "number", step: "1", min: "0", value: form.bedrooms, onChange: up("bedrooms") })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Lbl, { t: "BATHS" }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { className: "inp", type: "number", step: "0.5", min: "0", value: form.bathrooms, onChange: up("bathrooms") })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Lbl, { t: "RENT ($)/MO *" }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { className: "inp", type: "number", value: form.monthly_rent, onChange: up("monthly_rent") })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Lbl, { t: "DESCRIPTION" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("textarea", { className: "inp", value: form.description, onChange: up("description"), rows: 4, style: { resize: "vertical" }, placeholder: "Describe the property\u2026" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Lbl, { t: "AMENITIES (comma-separated)" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { className: "inp", value: form.amenities, onChange: up("amenities"), placeholder: "In-unit laundry, Parking, Central air, Pet-friendly" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 10, paddingTop: 4, borderTop: `1px solid ${C.stone}` }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                "input",
                {
                  type: "checkbox",
                  id: "pub",
                  checked: form.is_published,
                  onChange: (e) => setForm((f) => ({ ...f, is_published: e.target.checked })),
                  style: { width: 16, height: 16, accentColor: C.gold, cursor: "pointer" }
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { htmlFor: "pub", style: { fontSize: 14, color: C.text, cursor: "pointer" }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: "fas fa-eye", style: { marginRight: 7, color: C.clay } }),
                "Publish (visible on public site)"
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                "input",
                {
                  type: "checkbox",
                  id: "feat",
                  checked: form.is_featured,
                  onChange: (e) => setForm((f) => ({ ...f, is_featured: e.target.checked })),
                  style: { width: 16, height: 16, accentColor: C.gold, cursor: "pointer" }
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { htmlFor: "feat", style: { fontSize: 14, color: C.text, cursor: "pointer" }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: "fas fa-star", style: { marginRight: 7, color: C.gold } }),
                "Feature on homepage"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { background: "#FFF", border: `1px solid ${C.stone}`, borderRadius: 12, padding: "26px 22px", display: "flex", flexDirection: "column", gap: 16 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h3", { style: { fontFamily: F.serif, fontSize: 18, fontWeight: 400, color: C.text, marginBottom: 4 }, children: "Images" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { background: C.sand, borderRadius: 10, padding: "14px 16px" }, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("p", { style: { fontSize: 12.5, color: C.muted, lineHeight: 1.7 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: "fas fa-circle-info", style: { marginRight: 7, color: C.clay } }),
            "Enter direct image URLs. Unsplash format:",
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("br", {}),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("code", { style: { fontFamily: F.mono, fontSize: 11, color: C.terracotta, display: "block", marginTop: 6, wordBreak: "break-all" }, children: "https://images.unsplash.com/photo-ID?auto=format&fit=crop&w=800&q=80" })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Lbl, { t: "MAIN IMAGE URL" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { className: "inp", value: form.image_url, onChange: up("image_url"), placeholder: "https://images.unsplash.com/photo-\u2026" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { style: { fontSize: 11, color: C.subtle, marginTop: 5 }, children: "Primary image on property cards and detail page." })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Lbl, { t: "GALLERY IMAGES (one URL per line)" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
              "textarea",
              {
                className: "inp",
                value: form.gallery_images,
                onChange: up("gallery_images"),
                rows: 5,
                style: { resize: "vertical", fontFamily: F.mono, fontSize: 12 },
                placeholder: "https://images.unsplash.com/photo-\u2026\nhttps://images.unsplash.com/photo-\u2026"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { style: { fontSize: 11, color: C.subtle, marginTop: 5 }, children: "One URL per line. Shown in property detail gallery." })
          ] }),
          form.gallery_images && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { style: { fontSize: 11, color: C.subtle, marginBottom: 8, letterSpacing: "0.08em", fontWeight: 600 }, children: "GALLERY PREVIEW" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: form.gallery_images.split("\n").map((u, i) => u.trim() && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { width: 70, height: 50, borderRadius: 6, overflow: "hidden", border: `1px solid ${C.stone}` }, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
              "img",
              {
                src: u.trim(),
                alt: `Gallery ${i + 1}`,
                onError: (e) => {
                  e.target.style.opacity = "0.2";
                },
                style: { width: "100%", height: "100%", objectFit: "cover", display: "block" }
              }
            ) }, i)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", gap: 10, marginTop: 24 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "button",
          {
            className: "btn-brass",
            onClick: save,
            disabled: saving || saved,
            style: { padding: "12px 28px", display: "flex", alignItems: "center", gap: 7 },
            children: saved ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: "fas fa-check" }),
              " Saved!"
            ] }) : saving ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Spinner, { size: 14, color: C.espresso }),
              " Saving\u2026"
            ] }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("i", { className: "fas fa-floppy-disk" }),
              " Save Property"
            ] })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { onClick: () => navigate("AdminDashboard"), style: { background: "none", border: `1px solid ${C.stone}`, color: C.text, padding: "12px 22px", borderRadius: 8, fontSize: 13.5, cursor: "pointer" }, children: "Cancel" })
      ] })
    ] });
  }

  // src/App.tsx
  var import_jsx_runtime5 = __toESM(require_jsx_runtime());
  var PUBLIC_PAGES = [
    "Home",
    "Rentals",
    "PropertyDetail",
    "About",
    "Portfolio",
    "Process",
    "Contact",
    "NotFound"
  ];
  function NotFoundPage({ navigate }) {
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: {
      minHeight: "80vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "80px 28px",
      textAlign: "center",
      background: C.ivory
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("i", { className: "fas fa-house-chimney", style: { fontSize: 52, color: C.stone, marginBottom: 28 } }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("h1", { style: { fontFamily: F.serif, fontSize: 42, fontWeight: 300, color: C.text, marginBottom: 14 }, children: "Page Not Found" }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { style: { fontSize: 16, color: C.muted, lineHeight: 1.75, maxWidth: 420, marginBottom: 36 }, children: "The page you're looking for doesn't exist or may have moved." }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: { display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { className: "btn-primary", onClick: () => navigate("Home"), style: { padding: "13px 28px" }, children: "Back to Home" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { className: "btn-outline", onClick: () => navigate("Rentals"), style: { padding: "13px 28px" }, children: "Browse Rentals" })
      ] })
    ] });
  }
  function App() {
    const [page, setPage] = (0, import_react5.useState)("Home");
    const [selectedProp, setSelectedProp] = (0, import_react5.useState)(null);
    const [editTarget, setEditTarget] = (0, import_react5.useState)(null);
    const [isAdmin, setIsAdmin] = (0, import_react5.useState)(false);
    const [rentalFilters, setRentalFilters] = (0, import_react5.useState)({});
    (0, import_react5.useEffect)(() => {
      if (api.hasToken()) {
        api.auth.verify().then(() => setIsAdmin(true)).catch(() => {
          api.clearToken();
          setIsAdmin(false);
        });
      }
    }, []);
    (0, import_react5.useEffect)(() => {
      const slug = new URLSearchParams(window.location.search).get("p");
      if (!slug) return;
      const fetchFn = api.hasToken() ? api.admin.getPropertyBySlug(slug) : api.properties.getBySlug(slug);
      fetchFn.then((prop) => {
        setSelectedProp(prop);
        setPage("PropertyDetail");
      }).catch(() => {
        setSelectedProp(null);
        setPage("PropertyDetail");
      });
    }, []);
    const navigate = (p, data) => {
      const target = p;
      setPage(target);
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (data && target === "PropertyDetail") setSelectedProp(data);
      if (target === "Rentals") setRentalFilters(data || {});
    };
    const handleLogout = () => {
      api.clearToken();
      setIsAdmin(false);
      navigate("Home");
    };
    const isPublicPage = PUBLIC_PAGES.includes(page);
    const isAdminPage = !isPublicPage;
    if (isAdminPage && page !== "AdminLogin" && !isAdmin) {
      return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("style", { children: GLOBAL_CSS }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(AdminLoginPage, { navigate, onLogin: () => setIsAdmin(true) })
      ] });
    }
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("style", { children: GLOBAL_CSS }),
      isPublicPage && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Navbar, { currentPage: page, navigate }),
        page === "Home" && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(HomePage, { navigate }),
        page === "Rentals" && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(RentalsPage, { navigate, initialFilters: rentalFilters }),
        page === "PropertyDetail" && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(PropertyDetailPage, { property: selectedProp, navigate }),
        page === "About" && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(AboutPage, {}),
        page === "Portfolio" && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(PortfolioPage, {}),
        page === "Process" && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(ProcessPage, {}),
        page === "Contact" && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(ContactPage, {}),
        page === "NotFound" && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(NotFoundPage, { navigate }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Footer, { navigate })
      ] }),
      page === "AdminLogin" && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(AdminLoginPage, { navigate, onLogin: () => setIsAdmin(true) }),
      page === "AdminDashboard" && isAdmin && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(AdminDashboard, { navigate, onLogout: handleLogout, setEditTarget }),
      page === "AdminAddProperty" && isAdmin && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(AdminPropertyForm, { editTarget: null, navigate, onLogout: handleLogout }),
      page === "AdminEditProperty" && isAdmin && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(AdminPropertyForm, { editTarget, navigate, onLogout: handleLogout })
    ] });
  }
})();
/*! Bundled license information:

react/cjs/react.development.js:
  (**
   * @license React
   * react.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.development.js:
  (**
   * @license React
   * react-jsx-runtime.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
