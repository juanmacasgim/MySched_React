import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import { ButtonInterface } from '../interfaces/ButtonInterface';

const StyledButton  = styled(Button)({

});

const MyButton: React.FC<ButtonInterface> = ({ variant, onClick, children, endIcon }) => {
    return (
        <StyledButton variant={variant} onClick={onClick} endIcon={endIcon}>
            {children}
        </StyledButton>
    );
}

export default MyButton;