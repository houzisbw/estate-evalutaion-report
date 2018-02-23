import React, { Component } from 'react';
import './index.scss';
import {Button,Icon,Row,Col,Layout} from 'antd'
const { Header, Footer, Sider, Content } = Layout;
class App extends Component {
  render() {
    const ButtonGroup = Button.Group;
    return (
      <div className="test">
        <Button.Group>
          <Button href="http://www.baidu.com" target="_blank" type="primary">按钮</Button>
          <Button type="danger">按钮</Button>
        </Button.Group>
        {/*icon通过style设置颜色大小*/}
        <Icon type="step-forward" style={{color:'#111',fontSize:30}} spin="true"/>
        <Row >
          <Col span={12}>col-12</Col>
          <Col span={12}>col-12</Col>
        </Row>

      </div>
    );
  }
}

export default App;
