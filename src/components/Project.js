import React from 'react';
import TimeAgo from "react-timeago";
import {Link} from "react-router";


class Project extends React.Component {

    render() {

        const {data, ownership} = this.props;

        const dropDownMenu = (
            <div className='option-button'>

                {/* Template Literals :: ``     */}
                {/*  - `…${expression}…` 같은 표현은, ES6의 Template Literals 라는 문법입니다. 문자열 템플릿 안에 변수/상수 값을 손쉽게 넣을 수 있습니다. */}
                {/*  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals */}

                <a className='dropdown-button'
                    // id='dropdown-button-id'
                    // data-activates="dropdown-id"
                   id={`dropdown-button-${data._id}`}
                   data-activates={`dropdown-${data._id}`}>
                    <i className='material-icons icon-button'>more_vert</i> {/*땡땡땡*/}
                </a>

                <ul id={`dropdown-${data._id}`} className='dropdown-content'>
                    <li><a>Edit</a></li>
                    <li><a>Remove</a></li>
                </ul>

            </div>
        );

        const projView = (
            <div className='card'>
                <div className="info">
                    {/*<a className='username'>Writer</a> wrote a log · 1 seconds ago*/}
                    작성자: <a className='username'>{data.writer}</a>
                    <span className="time">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{data.date.created}</span>

                    {ownership ? dropDownMenu : undefined}

                    <div className='card-content'>
                        {data.contents}
                    </div>

                    <div className='footer'>
                        <i className='material-icons log-footer-icon star icon-button'>star</i>
                        <span className="star-count">0</span>
                        {/*<Link to="/workspace">*/}
                            {/*<span className='btn-modify'>수정하기</span>*/}
                        {/*</Link>*/}
                    </div>

                </div>
            </div>
        );

        return (
            <div className='container project'>
                {projView}
            </div>
        );
    }

    // 컴포넌트 props 업데이트 시, render 다음으로 실행됨
    componentDidUpdate() {
        // 컴포넌트가 업데이트 시, 드롭다운을 초기화
        // 로그인 시, ((뭔가가?)) 속성이 변하기 때문에 실행됨!
        $('#dropdown-button-' + this.props.data._id).dropdown({
            belowOrigin: true // 드롭다운을 버튼 밑에 보이게 함! (설정 안하면 땡땡땡 하고 겹쳐보임!)
        });
    }

    // 컴포넌트 생성 시, render 다음으로 실행됨
    componenDidMount() {
        $('#dropdown-button-' + this.props.data._id).dragDrop({
            belowOrigin: true // 드롭다운을 버튼 밑에 보이게 함!
        })
    }


}


// Project.propTypes = {
//
// }


// Proj Schema
// {
//     writer: String,
//     contents: String,
//     starred: [String],
//     date: {
//         created: { type: Date, default: Date.now },
//         edited: { type: Date, default: Date.now }
//     },
//     is_edited: {type: Boolean, default: false}
// }
Project.defaultProps = {
    data: {
        _id: 'id0123456789',
        writer: "undefined",
        contnets: "undefined",
        starred: [],
        date: {
            created: new Date(),
            edited: new Date()
        }
    },
    ownership: true
}


export default Project;