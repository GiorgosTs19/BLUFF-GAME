import {Card, Col, Row} from "react-bootstrap";
import {Link} from "@inertiajs/inertia-react";

export function WaitingRoomPlayer({name,isReady,canClickReady,showReadyButton,Room}) {
    return (
        <Card className='card border-1 p-2 h-100 shadow-lg bg-transparent'>
            <Card.Title className='card-title p-1 text-center mt-5'>
                <h4>
                    {name}
                </h4>
            </Card.Title>
            <Card.Body className='card-body'>
                <Row>
                    {isReady ? <h5 className={'mt-5 text-success'}>Player is Ready</h5>: <h5 className={'mt-5 text-warning'}>Player is not Ready</h5>}
                </Row>
                <Row className={'justify-content-center'}>
                    {showReadyButton &&
                        <Col xs={12} lg={6}>
                            <Link href={route('Ready')} method={'post'} data={{RoomId:Room.id}} as={'button'}
                                  className="btn btn-outline-success mt-4" type="button" disabled={!canClickReady ||  isReady}>
                                Ready
                            </Link>
                        </Col>
                    }
                </Row>
            </Card.Body>
        </Card>
    )
}
