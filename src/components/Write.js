// MVVC 에 VC 같은 느낌!

import React from "react"

class Write extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            contents: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handlePost = this.handlePost.bind(this);

    }

    handleChange(ev) {
        this.setState({
            contents: ev.target.value
        })
    }

    handlePost() {
        let contents = this.state.contents;

        this.props.onPost(contents) // 작성 완료 후,
            .then(() => { // 내용을 지워주는 코드!
                this.setState({
                    contents: ""
                });
            });

    }


    render() {
        return (
            <div className="container write">
                <div className='card'>
                    <div className='card-content'>
                        <textarea className='materialize-textarea'
                                  placeholder="Write your project's name"
                                  value = {this.state.contents}
                                  onChange={this.handleChange}></textarea>
                    </div>
                    <div className='card-action'>
                        <a onClick={this.handlePost}>MAKE</a>
                    </div>
                </div>
            </div>
        );
    }

}

Write.propTypes = {
    onPost: React.PropTypes.func
};

Write.defaultProps = {
    onPost: (contents) => console.error("Post function not defined")
}


export default Write;
