import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

function OrderSuccess() {
    const navigate = useNavigate();

    const handleBackHome = () => {
        navigate("/");
    }

    const handleBuyAgain = () => {
        navigate("/form-order");
    };

    return (
        <div>
            <Result
                status="success"
                title="Order Created Successfully!"
                subTitle="Your order has been created."
                extra={[
                    <Button type="primary" key="console" onClick={handleBackHome}>
                        Back homepage
                    </Button>,
                    <Button key="buy" onClick={handleBuyAgain}>
                        Buy Again
                    </Button>,
                ]}
            />
        </div>
    );
}

export default OrderSuccess;