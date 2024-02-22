import * as React from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { IconButton } from "@mui/material";

interface CardGameResultProps {
    cardTitle: string;
    onAddClick: () => void;
}
interface CardGameResultState { }

export default class CardGameResult extends React.Component<CardGameResultProps, CardGameResultState>
{
    constructor(props: CardGameResultProps) {
        super(props);
        this.state = {}
    }

    render(): React.ReactNode {
        const { cardTitle, onAddClick } = this.props;
        return (
            <div>
                <div>

                </div>
                <Card sx={{ maxWidth: 420, height: 80 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" fontSize={18} component="div">
                            {cardTitle}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <IconButton size="small"
                            onClick={onAddClick}
                        ><AddIcon /></IconButton>
                    </CardActions>
                </Card>
            </div>
        );
    }

}