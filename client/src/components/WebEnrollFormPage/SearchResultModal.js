import React, { useState,useEffect, useRef} from 'react'
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';


import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';

import { modalStyle, webFormStyle, primary1, primary2, borderColor } from './../../assets/WebEnrollCss';

const useTableStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 300,
  },
  container: {
    maxHeight: 440,
    height:'60vh',
    width:'100%',
  },
  tableRow: {
    padding:'0.2em 0.2m 0.2em 0.2em',    

  },
  tableCell: {
    flex: 1,
    padding: '0.2em',
  },

}));


function EnhancedTable(props) {

  const { onSelected } = props;

  const classes = useTableStyles();
  const [selected, setSelected] = useState(-1);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const list = props.listHCP;
    useEffect(() => {
        if( window.innerWidth < 768)
            setDense(true);

        return () => {
        };
    }, [])
  const handleClick = (event, index) => {
    setSelected(index);
    onSelected(index);    
  };

  //   const isSelected = name => selected.indexOf(name) !== -1;
  const isSelected = index => selected === index;


  console.log("List of HCPs : ",list);
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>     
    
        <TableContainer className={classes.container}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense? 'small':'medium'}
            aria-label="enhanced table"
            stickyHeader
          >
            <TableHead style={{font:'0.6rem'}}>
                <TableRow>
                <TableCell id={'check'} align={'center'} classes={{root:classes.tableCell}}></TableCell>
                <TableCell align={'center'} classes={{root:classes.tableCell}}>Doctor Name</TableCell>
                <TableCell align={'center'} classes={{root:classes.tableCell}}>NPI</TableCell>
                <TableCell align={'center'} classes={{root:classes.tableCell}}>Address</TableCell>
                <TableCell align={'center'} classes={{root:classes.tableCell}}>City</TableCell>
                <TableCell align={'center'} classes={{root:classes.tableCell}}>ZIP</TableCell>
                <TableCell align={'center'} classes={{root:classes.tableCell}}>STATE</TableCell>
                </TableRow>
            </TableHead>
            {list.length>0 && <TableBody style={{cursor:'pointer'}}>
              {list.map((item, index) => {
                  const isItemSelected = isSelected(index);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={event => handleClick(event, index)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={list.name_First}
                      selected={isItemSelected}
                      style={{color:isItemSelected? primary1:primary2}}
                    >
                      <TableCell classes={{root:classes.tableCell}} >
                        <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
                        />                         
                      </TableCell>
                      <TableCell component="th" id={labelId} align="right" scope="row" style={{color:isItemSelected? primary1:'rgba(0, 0, 0, 0.87)'}} classes={{root:classes.tableCell}}>
                        {`${item.name_First} ${item.name_Last}`}
                      </TableCell>
                      <TableCell align="right" style={{color:isItemSelected? primary1:'rgba(0, 0, 0, 0.87)'}}  classes={{root:classes.tableCell}}>{item.npi_Number}</TableCell>
                      <TableCell align="right" style={{color:isItemSelected? primary1:'rgba(0, 0, 0, 0.87)'}}  classes={{root:classes.tableCell}}>{item.bestInfo_Address_Line1}</TableCell>
                      <TableCell align="right" style={{color:isItemSelected? primary1:'rgba(0, 0, 0, 0.87)'}} classes={{root:classes.tableCell}}>{item.bestInfo_Address_City}</TableCell>
                      <TableCell align="right" style={{color:isItemSelected? primary1:'rgba(0, 0, 0, 0.87)'}} classes={{root:classes.tableCell}}>{item.bestInfo_Address_Zip}</TableCell>
                      <TableCell align="right" style={{color:isItemSelected? primary1:'rgba(0, 0, 0, 0.87)'}} classes={{root:classes.tableCell}}>{item.bestInfo_Address_State}</TableCell>
                    </TableRow>
                  );
                })}

            </TableBody>
            }
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}

const useStyles = makeStyles(webFormStyle);
const useModalStyles = makeStyles(modalStyle);

export default function SearchResultModal(props) {

    const searchHCPs = useSelector(state => state.searchHCPReducer.HCPs);
    const isLoading = useSelector(state => state.searchHCPReducer.isLoading);
    const isError = useSelector(state => state.searchHCPReducer.isError);
    const {
        name_First,
        name_Last,
        name_Middle,
        bestInfo_Address_Line1,
        bestInfo_Address_Line2,
        bestInfo_Address_City,
        bestInfo_Address_State,
        bestInfo_Address_Zip,
        npi_MedProID,
        npi_Number,
    } = searchHCPs;

    const { bModalOpen, onCloseModal, onClickNext } = props;

    const classes = useStyles();
    const modalClasses = useModalStyles();

    const [selected, setSelected] = useState(-1);
    const [open, setOpen] = useState(bModalOpen);

    const handleCheck=(index)=>{
        setSelected(index);
        // console.log('123',index);
    }
    return (
        <Modal
            className={modalClasses.modal}
            open={bModalOpen}
            onClose={onCloseModal}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
            timeout: 500,
            }}
        >
        <Fade in={bModalOpen}>
        <div className={modalClasses.paper}>
            <h5>{ isError? 'Connection failed !': isLoading ? 'Searching...' : searchHCPs.length>0 ? 'Search Results' : 'No Result'} </h5>
            <EnhancedTable listHCP={searchHCPs} onSelected={handleCheck}/>
            <Grid item container direction='row' style={{justifyContent: 'space-evenly'}}>
                <Grid>
                <Button className={classes.spanButton} onClick={onCloseModal}>Cancel</Button>
                </Grid>
                <Grid >
                <Button className={classes.spanButton} onClick={()=>onClickNext(selected)} disabled={selected===-1}>Next</Button>
                </Grid>
            </Grid>
        </div>
        </Fade>    
        </Modal>
        )

}
        