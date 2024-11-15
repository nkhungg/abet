import React, { useState, useEffect } from "react";
import { Route } from "react-router";
import { Layout, Menu } from "antd";
import HeaderComp from "../../components/header/Header";
import "./HomeTemplate.scss";
import { NavLink } from "react-router-dom";
import { Breadcrumb } from "antd";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { SET_FLOW_PROGRAM_VERSION, SET_FLOW_GENERAL_PROGRAM } from "../../redux/types";

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;
const menuList = [
  {
    id: 5,
    title: <FormattedMessage id="SUBJECT" />,
    path: "/subjects",
    icon: <i style={{ width: "50px" }} className="fa fa-book-open"></i>,
  },
  {
    id: 6,
    title: <FormattedMessage id="LECTURER" />,
    path: "/lecturer",
    icon: (
      <i style={{ width: "50px" }} className="fa fa-chalkboard-teacher"></i>
    ),
  },
  {
    id: 7,
    title: <FormattedMessage id="STUDENT" />,
    path: "/student",
    icon: <i style={{ width: "50px" }} className="fa fa-user-graduate"></i>,
  },
  {
    id: 8,
    title: <FormattedMessage id="SURVEY" />,
    path: "/survey",
    icon: <i style={{ width: "50px" }} className="fab fa-stack-overflow"></i>,
  },
  {
    id: 9,
    title: <FormattedMessage id="GUIDELINE" />,
    path: "/guideline",
    icon: <i style={{ width: "50px" }} className="fa fa-lightbulb"></i>,
  },
  {
    id: 10,
    title: <FormattedMessage id="FEEDBACK" />,
    path: "/feedback",
    icon: <i style={{ width: "50px" }} className="fa fa-comment-dots"></i>,
  },
  {
    id: 11,
    title: <FormattedMessage id="REPORT" />,
    path: "/report",
    icon: <i style={{ width: "50px" }} className="fa fa-file-alt"></i>,
  },
];

//props = {component:Home,path:'/home'}
export default function HomeTemplate(props) {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    collapsed: false,
    selectedCateId: 1,
  });

  const arrayBreadcrumb = props.location.pathname.substring(1).split("/");

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  useEffect(() => {
    if(props.location.pathname === '/' || props.location.pathname.startsWith('/general-program')) {
      dispatch({
        type: SET_FLOW_GENERAL_PROGRAM,
        payload: arrayBreadcrumb,
      });
    }
    dispatch({
      type: SET_FLOW_PROGRAM_VERSION,
      payload: arrayBreadcrumb,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderBreadCrumb = () => {
    let pathArr = [];
    return arrayBreadcrumb?.map((route, idx) => {
      pathArr.push(route);
      let path = pathArr.join("/");
      return (
        <Breadcrumb.Item key={idx}>
          <NavLink
            className={idx % 2 === 1 ? "none-allowed" : ""}
            to={`/${path}`}
          >
            <span style={{ cursor: idx % 2 === 1 ? "not-allowed" : "" }}>
              {capitalizeFirstLetter(route)}
            </span>
          </NavLink>
        </Breadcrumb.Item>
      );
    });
  };

  const onCollapse = (collapsed) => {
    setState({ collapsed });
  };

  const renderMenuList = () => {
    return menuList.map((menu) => {
      return (
        <Menu.Item key={menu.id}>
          <NavLink exact to={menu.path}>
            <span style={{ color: "#fff", fontSize: "15px", width: "100px" }}>
              {menu.icon}
            </span>
            <span style={{ color: "#fff", fontWeight: "400" }}>
              {menu.title}
            </span>
          </NavLink>
        </Menu.Item>
      );
    });
  };

  return (
    <Route
      path={props.path}
      exact
      render={(propsRoute) => {
        return (
          // first drak layout antd
          <Layout style={{ minHeight: "100vh" }}>
            <Sider
              width="220"
              id="sidebar"
              collapsible
              collapsed={state.collapsed}
              onCollapse={onCollapse}
              style={{ boxShadow: "3px 3px 6px #929292" }}
            >
              <h4 className="text-white font-weight-bold text-center pt-4 pb-2">
                <FormattedMessage id="MENU" />
              </h4>

              <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
                <SubMenu
                  key="sub1"
                  title={
                    <div>
                      <span
                        style={{
                          color: "#fff",
                          fontSize: "15px",
                          width: "100px",
                        }}
                      >
                        <i
                          style={{ width: "50px" }}
                          className="fa fa-school"
                        ></i>
                      </span>
                      <span style={{ color: "#fff", fontWeight: "400" }}>
                        <FormattedMessage id="PROGRAM" />
                      </span>
                    </div>
                  }
                >
                  <Menu.Item key="1">
                    <NavLink exact to="/general-program">
                      <span
                        style={{
                          color: "#fff",
                          fontSize: "15px",
                          width: "100px",
                        }}
                      >
                        <i
                          style={{ width: "40px" }}
                          className="fa fa-sitemap"
                        ></i>
                      </span>
                      <span style={{ color: "#fff", fontWeight: "400" }}>
                        <FormattedMessage id="GENERAL_PROGRAM" />
                      </span>
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item key="2">
                    <NavLink exact to="/program-version">
                      <span
                        style={{
                          color: "#fff",
                          fontSize: "15px",
                          width: "100px",
                        }}
                      >
                        <i
                          style={{ width: "40px" }}
                          className="fa fa-code-branch"
                        ></i>
                      </span>
                      <span style={{ color: "#fff", fontWeight: "400" }}>
                        <FormattedMessage id="PROGRAM_VESION" />
                      </span>
                    </NavLink>
                  </Menu.Item>
                </SubMenu>

                <SubMenu
                  key="sub2"
                  title={
                    <div>
                      <span
                        style={{
                          color: "#fff",
                          fontSize: "20px",
                          width: "100px",
                        }}
                      >
                        <i style={{ width: "50px" }} className="fa fa-book"></i>
                      </span>
                      <span style={{ color: "#fff", fontWeight: "400" }}>
                        <FormattedMessage id="COURSE" />
                      </span>
                    </div>
                  }
                >
                  <Menu.Item key="3">
                    <NavLink exact to="/general-course">
                      <span
                        style={{
                          color: "#fff",
                          fontSize: "15px",
                          width: "100px",
                        }}
                      >
                        <i
                          style={{ width: "40px" }}
                          className="fa fa-list-alt"
                        ></i>
                      </span>
                      <span style={{ color: "#fff", fontWeight: "400" }}>
                        <FormattedMessage id="GENERAL_COURSE" />
                      </span>
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item key="4">
                    <NavLink exact to="/course-instance">
                      <span
                        style={{
                          color: "#fff",
                          fontSize: "15px",
                          width: "100px",
                        }}
                      >
                        <i
                          style={{ width: "40px" }}
                          className="fab fa-leanpub"
                        ></i>
                      </span>
                      <span style={{ color: "#fff", fontWeight: "400" }}>
                        <FormattedMessage id="COURSE_INSTANCE" />
                      </span>
                    </NavLink>
                  </Menu.Item>
                </SubMenu>

                {renderMenuList()}

                <SubMenu
                  key="sub3"
                  title={
                    <div>
                      <span
                        style={{
                          color: "#fff",
                          fontSize: "15px",
                          width: "100px",
                        }}
                      >
                        <i
                          style={{ width: "50px" }}
                          className="fa fa-user-shield"
                        ></i>
                      </span>
                      <span style={{ color: "#fff", fontWeight: "400" }}>
                        <FormattedMessage id="ADMINISTRATION" />
                      </span>
                    </div>
                  }
                >
                  <Menu.Item key="12">
                    <NavLink exact to="/users">
                      <span
                        style={{
                          color: "#fff",
                          fontSize: "15px",
                          width: "100px",
                        }}
                      >
                        <i style={{ width: "40px" }} className="fa fa-user"></i>
                      </span>
                      <span style={{ color: "#fff", fontWeight: "400" }}>
                        <FormattedMessage id="AD_USERS" />
                      </span>
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item key="13">
                    <NavLink exact to="/roles">
                      <span
                        style={{
                          color: "#fff",
                          fontSize: "15px",
                          width: "100px",
                        }}
                      >
                        <i
                          style={{ width: "40px" }}
                          className="fab fa-critical-role"
                        ></i>
                      </span>
                      <span style={{ color: "#fff", fontWeight: "400" }}>
                        <FormattedMessage id="AD_ROLES" />
                      </span>
                    </NavLink>
                  </Menu.Item>
                  {/* <Menu.Item key="14">
                    <NavLink exact to="/attributes">
                      <span
                        style={{
                          color: "#fff",
                          fontSize: "15px",
                          width: "100px",
                        }}
                      >
                        <i
                          style={{ width: "40px" }}
                          className="fa fa-list-ul"
                        ></i>
                      </span>
                      <span style={{ color: "#fff", fontWeight: "400" }}>
                        <FormattedMessage id="AD_ATTRIBUTE" />
                      </span>
                    </NavLink>
                  </Menu.Item> */}
                </SubMenu>
              </Menu>
            </Sider>
            <Layout className="site-layout">
              <Header
                className="site-layout-background"
                style={{
                  padding: 0,
                  boxShadow: "2px 3px 8px 5px #d9d9d9",
                  background: "#A3D8FF",
                }}
              >
                <HeaderComp />
              </Header>
              <Content
                className="my-3 mx-3 px-4"
                style={{
                  background: "#FFFFFF",
                  borderRadius: "5px",
                  boxShadow: "3px 3px 3px 6px #d9d9d9",
                }}
              >
                {/* --------------- */}
                <Breadcrumb className="mt-3 d-flex align-items-center">
                  <Breadcrumb.Item>
                    Home
                    {/* <FormattedMessage id='HOME' /> */}
                  </Breadcrumb.Item>
                  {renderBreadCrumb()}
                </Breadcrumb>
                {/* --------------- */}
                <props.component {...propsRoute} />
              </Content>
            </Layout>
          </Layout>
        );
      }}
    />
  );
}
