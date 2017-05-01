'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var ReactDOM = require('react-dom');
var PropTypes = require('prop-types');
var findDOMNode = ReactDOM.findDOMNode;
var className = require('classnames');
var debounce = require('lodash.debounce');

function normalizeLineEndings(str) {
	if (!str) return str;
	return str.replace(/\r\n|\r/g, '\n');
}

var Codemirror = (function (_React$Component) {
	_inherits(Codemirror, _React$Component);

	function Codemirror(props) {
		_classCallCheck(this, Codemirror);

		_get(Object.getPrototypeOf(Codemirror.prototype), 'constructor', this).call(this, props);
		this.state = {
			isFocused: false
		};
		this.getCodeMirror = this.getCodeMirror.bind(this);
		this.getCodeMirrorInstance = this.getCodeMirrorInstance.bind(this);
		this.focus = this.focus.bind(this);
		this.focusChanged = this.focusChanged.bind(this);
		this.scrollChanged = this.scrollChanged.bind(this);
		this.codemirrorValueChanged = this.codemirrorValueChanged.bind(this);
	}

	_createClass(Codemirror, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			this.componentWillReceiveProps = debounce(this.componentWillReceiveProps, 0);
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var textareaNode = findDOMNode(this.refs.textarea);
			var codeMirrorInstance = this.getCodeMirrorInstance();
			this.codeMirror = codeMirrorInstance.fromTextArea(textareaNode, this.props.options);
			this.codeMirror.on('change', this.codemirrorValueChanged);
			this.codeMirror.on('focus', this.focusChanged.bind(this, true));
			this.codeMirror.on('blur', this.focusChanged.bind(this, false));
			this.codeMirror.on('scroll', this.scrollChanged);
			this.codeMirror.setValue(this.props.defaultValue || this.props.value || '');
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			// is there a lighter-weight way to remove the cm instance?
			if (this.codeMirror) {
				this.codeMirror.toTextArea();
			}
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			if (this.codeMirror && nextProps.value !== undefined && normalizeLineEndings(this.codeMirror.getValue()) !== normalizeLineEndings(nextProps.value)) {
				if (this.props.preserveScrollPosition) {
					var prevScrollPosition = this.codeMirror.getScrollInfo();
					this.codeMirror.setValue(nextProps.value);
					this.codeMirror.scrollTo(prevScrollPosition.left, prevScrollPosition.top);
				} else {
					this.codeMirror.setValue(nextProps.value);
				}
			}
			if (typeof nextProps.options === 'object') {
				for (var optionName in nextProps.options) {
					if (nextProps.options.hasOwnProperty(optionName)) {
						this.codeMirror.setOption(optionName, nextProps.options[optionName]);
					}
				}
			}
		}
	}, {
		key: 'getCodeMirrorInstance',
		value: function getCodeMirrorInstance() {
			return this.props.codeMirrorInstance || require('codemirror');
		}
	}, {
		key: 'getCodeMirror',
		value: function getCodeMirror() {
			return this.codeMirror;
		}
	}, {
		key: 'focus',
		value: function focus() {
			if (this.codeMirror) {
				this.codeMirror.focus();
			}
		}
	}, {
		key: 'focusChanged',
		value: function focusChanged(focused) {
			this.setState({
				isFocused: focused
			});
			this.props.onFocusChange && this.props.onFocusChange(focused);
		}
	}, {
		key: 'scrollChanged',
		value: function scrollChanged(cm) {
			this.props.onScroll && this.props.onScroll(cm.getScrollInfo());
		}
	}, {
		key: 'codemirrorValueChanged',
		value: function codemirrorValueChanged(doc, change) {
			if (this.props.onChange && change.origin !== 'setValue') {
				this.props.onChange(doc.getValue(), change);
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var editorClassName = className('ReactCodeMirror', this.state.isFocused ? 'ReactCodeMirror--focused' : null, this.props.className);
			return React.createElement('div', { className: editorClassName }, React.createElement('textarea', {
				ref: 'textarea',
				name: this.props.path,
				defaultValue: this.props.value,
				autoComplete: 'off'
			}));
		}
	}]);

	return Codemirror;
})(React.Component);

Codemirror.propTypes = {
	className: PropTypes.any,
	codeMirrorInstance: PropTypes.func,
	defaultValue: PropTypes.string,
	onChange: PropTypes.func,
	onFocusChange: PropTypes.func,
	onScroll: PropTypes.func,
	options: PropTypes.object,
	path: PropTypes.string,
	value: PropTypes.string,
	preserveScrollPosition: PropTypes.bool
};
Codemirror.defaultProps = {
	preserveScrollPosition: false
};
Codemirror.displayName = 'CodeMirror';

exports['default'] = Codemirror;
module.exports = exports['default'];