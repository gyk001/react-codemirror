'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
const PropTypes = require('prop-types');
var findDOMNode = ReactDOM.findDOMNode;
var className = require('classnames');
var debounce = require('lodash.debounce');

function normalizeLineEndings(str) {
	if (!str) return str;
	return str.replace(/\r\n|\r/g, '\n');
}

class Codemirror extends React.Component {
	constructor(props) {
		super(props);
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


	componentWillMount() {
		this.componentWillReceiveProps = debounce(this.componentWillReceiveProps, 0);
	}

	componentDidMount() {
		var textareaNode = findDOMNode(this.refs.textarea);
		var codeMirrorInstance = this.getCodeMirrorInstance();
		this.codeMirror = codeMirrorInstance.fromTextArea(textareaNode, this.props.options);
		this.codeMirror.on('change', this.codemirrorValueChanged);
		this.codeMirror.on('focus', this.focusChanged.bind(this, true));
		this.codeMirror.on('blur', this.focusChanged.bind(this, false));
		this.codeMirror.on('scroll', this.scrollChanged);
		this.codeMirror.setValue(this.props.defaultValue || this.props.value || '');
	}

	componentWillUnmount() {
		// is there a lighter-weight way to remove the cm instance?
		if (this.codeMirror) {
			this.codeMirror.toTextArea();
		}
	}

	componentWillReceiveProps(nextProps) {
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

	getCodeMirrorInstance() {
		return this.props.codeMirrorInstance || require('codemirror');
	}

	getCodeMirror() {
		return this.codeMirror;
	}

	focus() {
		if (this.codeMirror) {
			this.codeMirror.focus();
		}
	}

	focusChanged(focused) {
		this.setState({
			isFocused: focused
		});
		this.props.onFocusChange && this.props.onFocusChange(focused);
	}

	scrollChanged(cm) {
		this.props.onScroll && this.props.onScroll(cm.getScrollInfo());
	}

	codemirrorValueChanged(doc, change) {
		if (this.props.onChange && change.origin !== 'setValue') {
			this.props.onChange(doc.getValue(), change);
		}
	}

	render() {
		var editorClassName = className('ReactCodeMirror', this.state.isFocused ? 'ReactCodeMirror--focused' : null, this.props.className);
		return React.createElement(
			'div',
			{className: editorClassName},
			React.createElement('textarea', {
				ref: 'textarea',
				name: this.props.path,
				defaultValue: this.props.value,
				autoComplete: 'off'
			})
		);
	}
}

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

export default Codemirror;
