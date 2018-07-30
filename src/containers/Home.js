
import React, {Component} from 'react';

import {connect} from 'react-redux';

import Write from "../components/Write";
import {projPostRequest, projListRequest} from "../actions/project";

import {mockData} from "../mocks";

import ProjectList from "../components/ProjectList";



class Home extends Component {

    constructor(props){
        super(props);

        this.handlePost = this.handlePost.bind(this);
        this.loadNewProj = this.loadNewProj.bind(this);
        this.loadOldProj = this.loadOldProj.bind(this);

        this.state = {
            loadState: false
        }

    }



    // 리듀셔 액션 생성자 리퀘스트에 뷰에서 대응하는 핸들러!

    // 리듀서에 등록된 project state
    // post: {   ==>> postStatus
    //     status: 'INIT',
    //     error: -1
    // }
    handlePost(contents){
        return this.props.projPostRequest(contents)
            .then(() => {
                if(this.props.postStatus.status === "SUCCESS"){
                    // 새로운 프로젝트 로딩
                    this.loadNewProj()
                        .then(() => Materialize.toast("Success!", 3000));

                } else {

                    // data.code 1: 로그인 안됨, 2: 내용이 비어있
                    let $toastContent;
                    switch (this.props.postStatus.error) {
                        case 1: // TODO: !! $() 이거 jquery 인거 같은데 알아보기
                            $toastContent = $('<span style="color=#FFB4BA">You need to sign in first</span>');
                            Materialize.toast($toastContent, 2500);
                            setTimeout(() => {location.reload(false);}, 2000);  // 2초 대기 후 새로고침 코드
                            break;
                        case 2:
                            $toastContent = $('<span style="color=#FFB4BA">Empty contents</span>');
                            Materialize.toast($toastContent, 2500);
                            break;
                        default:
                            $toastContent = $('<span style="color=#FFB4BA">Unknown error</span>');
                            Materialize.toast($toastContent, 2500);
                            break;
                    }

                }
            });

    }


    // 새 프로젝트를 읽을 때 사용하는 함수
    loadNewProj() {

        // 리퀘스트 팬딩일 때, 취소함
        // 이 작업을 안하면, (새 메모 작성 + 새 메모 로드) 기능이 동작하면서 두번 입력될 수 있는 것을 방지!
        // 리스트 읽어올 때, 한 번에 한 동작만 하도록 하는 코드!
        if(this.props.listStatus === 'WAITING')
            return new Promise((resolve, reject) => { // Write.js 에서 유용하기 쓰기 위함!
                resolve();
            });

        // 페이지가 비어있을 때, initial 로딩함!
        if(this.props.projsData.length === 0)
            return this.props.projListRequest(true);

        // routes/project.js :: router.get()
        //   위의 코드 보면, 던져준 아이디 기준 다른 프로젝트들을 자동탐색한다! (첫 번째만 던져주면 됨)
        //    로드 된 프로젝트 중, 최상단 프로젝트 아이디를 넘김
        return this.props.projListRequest(false, 'new', this.props.projsData[0]._id);

    }

    loadOldProj() {

        // 불러올 메모 없을 시, 요청 취소됨.
        // TODO: loadOldProj.then 을 쓰기 위해 빈 프로미스를 반환..?
        if(this.props.isLast){
            return new Promise((resolve, reject) => {
                resolve();
            });
        }

        // 로드 된 프로젝트 중, 가장 아래 있는 프로젝트를 부름
        let lastId = this.props.projsData[this.props.projsData.length-1]._id;

        // 아이디 넘기는건 아직 구현이 안되어 있음(step04)
        // $lt 이기 때문에 로드된 프로젝트 중, 가장 아래 있는 프로젝트보다 더 이전 프로젝트들을 불러온다!
        return this.props.projListRequest(false,'old',lastId)
            .then(() => {
                if(this.props.isLast)
                    Materialize.toast("You're just reached the last project", 1500);
            });

    }





    render() {

        const write = (
            <Write onPost={this.handlePost}/>
        );

        return (
            <div className='wrapper'>
                {/*state.authentication.status.isLoggedIn*/}
                {/*여기서 위처럼 접근이 불가능하다!!*/}
                {/*반드시 아래 함수를 통해서 리덕스 스토어랑 프롭스를 연결해주어야 한다!!!*/}
                { this.props.isLoggedIn ? write : undefined }

                <ProjectList data={this.props.projsData} currentUser={this.props.currentUser}/>
            </div>
        );
    }


    // 컴포넌트 생성 시 render 이후 구동!
    componentDidMount() {

        //  5초마다 새로운 프로젝트 로드
        const loadProjLoop = () => {
            this.loadNewProj()
                .then(() => {
                    this.projLoaderTimeoutId = setTimeout(loadProjLoop, 5000);
                });
        };

        this.props.projListRequest(true)
            // .then(()=>console.log(this.props.projData));
            .then(()=>{
                loadUntilScrollable(); // 스크롤바 생길 때까지 로드 //TODO: 뭔가 문제있음...
                loadProjLoop(); // 프로젝트 로딩 루프 시작
            });


        // 무한 스크롤 코드
        //  1. 스크롤바 위치 계산
        //  2. 스크롤바가 아래 부분과 가까워지면,
        //  3. 내용물을 추가!
        $(window).scroll(() => {
            // (문서 높이 - 창 높이) = 창을 제외한 보이지 않는 문서의 높이
            // 보이지 않는 문서 높이 - 스크롤 한 창의 위쪽 위치 => 문서 밑에까지의 높이!
            if ($(document).height() - $(window).height() - $(window).scrollTop() < 250){
                if(!this.state.loadState) {
                    this.loadOldProj();
                    // 구간에 들어갔을 때, 로딩 모드를 켜줌!
                    this.setState({
                        loadState: true
                    });
                }
            } else {
                if(this.state.loadState) {
                    // 나오게 되면 꺼줌!
                    this.setState({
                        loadState: false
                    });
                }
            }

        });


        // 스크롤바 없을 시, 로딩 안되는 것을 해결하는 코드
        // 스크롤바가 생길 때까지 프로젝트 개수를 로드!
        const loadUntilScrollable = () => {
            if($("body").height() < $(window).height()) {
                // 바디 태그 높이가 윈도우보다 적을 때, 마지막이 아니라면,
                //   재귀적으로 계속해서 오래된 프로젝트 로드!
                this.loadOldProj()
                    .then(() => {
                        if(!this.props.isLast) loadUntilScrollable();
                    })
            }
        }



    }

    // 컴포넌트 헤제 시, 타이머 정지
    componentWillUnmount() {
        clearTimeout(this.projLoaderTimeoutId);
    }


}


// 리덕스 스토어 연결 코드
//  - 파라미터로 각각 리덕스 스토어의 state와 dispatch를 가져옴!
const mapStateToProps = (state) => ({  // 리덕스 스토어로 받은 스테이트값!!
    isLoggedIn: state.authentication.status.isLoggedIn,
    postStatus: state.project.post,

    currentUser: state.authentication.status.currentUser,
    projsData: state.project.list.data,
    listStatus: state.project.list.status,
    isLast: state.project.list.isLast
});

const mapDispatchToProps = (dispatch) => ({
    projPostRequest: (contents) => dispatch(projPostRequest(contents)),
    projListRequest: (isInitial, listType, id, username) => dispatch(projListRequest(isInitial, listType, id, username))
});


export default connect(mapStateToProps, mapDispatchToProps)(Home);