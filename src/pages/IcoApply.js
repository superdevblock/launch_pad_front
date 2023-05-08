import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';

export default function IcoApply() {
    const [name , setName] = useState('');
    const [email , setEmail] = useState('');
    const [desc , setDesc] = useState('');
    const [platform , setPlatform] = useState('');
    const [p_status , setP_status] = useState('');
    const [fund , setFund] = useState('');
    const [publics , setPublics] = useState('');
    const [target , setTarget] = useState('');
    const [website , setWebsite] = useState('');
    const [blockstar , setBlockstar] = useState('');
    const [telegram , setTelegram] = useState('');
    const [twitter , setTwitter] = useState('');
    const [whitepaper , setWhitepaper] = useState('');
    const [logo , setLogo] = useState('');

    const sendEmail = (e) =>{
        e.preventDefault();
        
        emailjs.init("D0e6jDLeDczlTXl7M");
       if(name !== '' && email !== '' && desc !== '' && platform !== '' && p_status !== '' && fund !== '' && publics !== '' && target !== '' && website !== '' && blockstar !== '' && telegram !== '' && twitter !== '' && whitepaper !== '' && logo !== ''){
            emailjs.sendForm("service_j87a137" , "template_weimawp" , "#myForm")
            .then((result)=>{
                toast.success('Save Data Successfully ! Thank you');
            })
            .catch((err)=>{
                console.log(err.message);
                toast.success('Something Went Wrong !');
            });
        }
        else{
            toast.error('All Field required !');
        }
    }


  return (
    <React.Fragment>
        {/* <!-- Breadcrumbs Section Start --> */}
        <div className="gamfi-breadcrumbs-section">
            <div className="container">
                <div className="apply-heading text-center">
                    <h2 className="mb-0">Apply for ICO/IDO</h2>
                </div>
            </div>
        </div>
        {/* <!-- Breadcrumbs  Section End --> */}

        {/* <!-- Form Section Start --> */}
        <div className="gamfi-form-content pt-65 md-pt-45 pb-120 md-pb-80">
            <div className="container">
                <div className="address-form">
                    <form id='myForm'>
                        <div className="input-button">
                            <input type="text" name="name" id="name" placeholder="Project Name" onChange={(e)=>setName(e.target.value)} required />
                            <label for="name">Project Name</label>
                        </div>
                        <div className="input-button">
                            <input type="text" name="logo" id="logo" placeholder="Project Logo Image Url" onChange={(e)=>setLogo(e.target.value)} required />
                            <label for="logo">Project Logo Url</label>
                        </div>
                        <div className="input-button">
                            <input type="email" onChange={(e)=>setEmail(e.target.value)} id="email" name="email" placeholder="Email Address" required />
                            <label for="email">Email address</label>
                        </div>
                        <div className="input-button">
                            <input type="text" id="brief" name="desc" className="brief" placeholder="Project Brief" required onChange={(e)=>setDesc(e.target.value)} />
                            <label for="brief">Project Brief</label>
                        </div>
                        <div className="radio-button">
                            <h5 className="mt-35">Blockchain/Platform</h5>
                            <div className="input-list">
                                <input type="radio" id="binance" name="platform" value="Base Chain" onChange={(e)=>setPlatform(e.target.value)} />
                                <label for="binance">Base Chain</label>
                                <div className="check"></div>
                            </div>
                            <div className="input-list">
                                <input type="radio" id="solana" name="platform" value="Solana" onChange={(e)=>setPlatform(e.target.value)}/>
                                <label for="solana">Solana</label>
                                <div className="check"></div>
                            </div>
                            <div className="input-list">
                                <input type="radio" id="ethereum" name="platform" value="Ethereum" onChange={(e)=>setPlatform(e.target.value)}/>
                                <label for="ethereum">Ethereum</label>
                                <div className="check"></div>
                            </div>
                            <div className="input-list">
                                <input type="radio" id="polkadot" name="platform" value="Polkadot" onChange={(e)=>setPlatform(e.target.value)} />
                                <label for="polkadot">Polkadot</label>
                                <div className="check"></div>
                            </div>
                            <div className="input-list">
                                <input type="radio" id="polygon" name="platform" value="Polygon (Matic)" onChange={(e)=>setPlatform(e.target.value)}/>
                                <label for="polygon">Polygon (Matic)</label>
                                <div className="check"></div>
                            </div>
                            <h5 className="mt-25">Project status</h5>
                            <div className="input-list">
                                <input type="radio" id="idea" name="p_status" value="Just an initial idea" onChange={(e)=>setP_status(e.target.value)}/>
                                <label for="idea">Just an initial idea</label>
                                <div className="check"></div>
                            </div>
                            <div className="input-list">
                                <input type="radio" id="paper" name="p_status" value="Idea with White Paper" onChange={(e)=>setP_status(e.target.value)}/>
                                <label for="paper">Idea with White Paper</label>
                                <div className="check"></div>
                            </div>
                            <div className="input-list">
                                <input type="radio" id="development" name="p_status" value="In early development" onChange={(e)=>setP_status(e.target.value)}/>
                                <label for="development">In early development</label>
                                <div className="check"></div>
                            </div>
                            <div className="input-list">
                                <input type="radio" id="launch" name="p_status" value="Ready to launch" onChange={(e)=>setP_status(e.target.value)}/>
                                <label for="launch">Ready to launch</label>
                                <div className="check"></div>
                            </div>
                            <h5 className="mt-30 mb-22">Have you already raised funds ?</h5>
                            <div className="input-list">
                                <input type="radio" id="yes" name="fund" value="Yes" onChange={(e)=>setFund(e.target.value)}/>
                                <label for="yes">Yes</label>
                                <div className="check"></div>
                            </div>
                            <div className="input-list">
                                <input type="radio" id="no" name="fund" value="No" onChange={(e)=>setFund(e.target.value)}/>
                                <label for="no">No</label>
                                <div className="check"></div>
                            </div>
                            <h5 className="mt-34 mb-22">Is your team Anon or public</h5>
                            <div className="input-list">
                                <input type="radio" id="anon" name="publics" value="Anon" onChange={(e)=>setPublics(e.target.value)}/>
                                <label for="anon">Anon</label>
                                <div className="check"></div>
                            </div>
                            <div className="input-list"> 
                                <input type="radio" id="public" name="publics" value="Fully Public" onChange={(e)=>setPublics(e.target.value)}/>
                                <label for="public">Fully Public</label>
                                <div className="check"></div>
                            </div>
                            <div className="input-list">
                                <input type="radio" id="mixed" name="publics" value="Mixed" onChange={(e)=>setPublics(e.target.value)}/>
                                <label for="mixed">mixed</label>
                                <div className="check"></div>
                            </div>
                        </div>
                        <div className="input-button">
                            <input type="text" id="target" name="target" placeholder="How much are you planning on raising on the ICO?" required onChange={(e)=>setTarget(e.target.value)} />
                            <label for="target">Target Raise</label>
                        </div>  
                        <div className="input-button">
                            <input type="text" name="website" id="website" placeholder="Enter link" required  onChange={(e)=>setWebsite(e.target.value)}/>
                            <label for="website">Project Website </label>
                        </div>
                        <div className="input-button">
                            <input type="text" name="whitepaper" id="whitepaper" placeholder="Enter link" required  onChange={(e)=>setWhitepaper(e.target.value)}/>
                            <label for="whitepaper">Link to whitepaper </label>
                        </div>
                        
                        <div className="input-button group">
                            <i className="icon-star"></i>
                            <input type="text" className="enter" id="blockstar" name="blockstar"  placeholder="Enter Blockstar group link" required onChange={(e)=>setBlockstar(e.target.value)} />
                            <label for="blockstar">Blockstar group</label>
                        </div>   
                        <div className="input-button group">
                            <i className="icon-telegram"></i>
                            <input type="text" name="telegram" className="enter" id="telegram"   placeholder="Enter telegram group link" required onChange={(e)=>setTelegram(e.target.value)} />
                            <label for="telegram">Telegram group</label>
                        </div> 
                        <div className="input-button">
                            <i className="icon-twitter"></i>
                            <input type="text"  className="enter" id="twitter" name="twitter" placeholder="Enter telegram group link" required onChange={(e)=>setTwitter(e.target.value)} />
                            <label for="twitter">Project Twitter</label>
                        </div>  
                        <div className="text-center mt-40">
                            <button className='btn btn-primary' onClick={(e) => sendEmail(e)}>
                                Submit
                             </button>
                            <span className="hover-shape1"></span>
                            <span className="hover-shape2"></span>
                            <span className="hover-shape3"></span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        {/* <!-- Form Section End --> */}
    </React.Fragment>
  )
}
