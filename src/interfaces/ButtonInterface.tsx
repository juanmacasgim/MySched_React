/*
* Interfaz de las propiedades del componente
*/
export interface ButtonInterface {
    variant: 'text' | 'outlined' | 'contained';
    className?: string;
    onClick: () => void;
    endIcon?: React.ReactNode;
    children: React.ReactNode;
}