import * as React from "react";
import {NavLink} from "react-router-dom";
import "./styles/Header.css";
import {connect} from "react-redux";

class Header extends React.Component {
    render() {
        return (
            <div className={"Header"}>
                <NavLink className={"home-link"} to={"/"}>Home</NavLink>
                <div className={"user"}>{this.props.username}</div>
            </div>
        );
    }
}

const mapStateToProps = state => ({username: state.main.token});
const mapDispatchToProps = null;
export default connect(mapStateToProps, mapDispatchToProps)(Header);