import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function LoaderTables() {
  return (
    <Box sx={{ 
        position: 'relative',
        width: '300px',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        alignItems: 'center',
        marginTop: '30%'
        }}>
      <CircularProgress color="primary" />
    </Box>
  );
}