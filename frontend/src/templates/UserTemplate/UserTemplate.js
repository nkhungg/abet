import React from 'react'
import { Route } from "react-router";

//props = {component:Home,path:'/home'}
export default function UserTemplate(props) {
    return (
        <Route path={props.path} exact render={(propsRoute) => {
            return (
              <div>
                <props.component {...propsRoute} />
              </div>
            );
          }}
        />
    )
}
