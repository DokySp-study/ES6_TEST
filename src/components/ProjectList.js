
import React from "react";
import Project from "./Project";




class ProjectList extends React.Component {

    render() {

        const mapToComponent = data => data.map((proj, i) => ((
            <Project
                data={proj}
                ownership={ (proj.writer === this.props.currentUser) }
                key={proj._id}
            />
        )));


        return (
            <div>
                {mapToComponent(this.props.data)}
            </div>
        )
    };

}


ProjectList.defaultProps = {
    data: [],
    currentUser: ''
}


export default ProjectList;