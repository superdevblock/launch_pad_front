import React from 'react';
import styled from "styled-components";


const Area_info = styled.div`
	margin-bottom: 30px;
`;

const Title = styled.h1`
  justfiy-contents: center;
	font-size: 45px;
	margin-top: 50px;
	margin-bottom: 30px;
	margin-right:10px; 
	font-weight: bold;
	margin-left: 10px;
`;

const SubTitle = styled.h2`
	margin: 20px 0;
	font-size: var(--h2-size);
	font-weight: var(--h2-weight);
	line-height: 1;
	font-family: var(--primary-font);
	color: var(--primary-t-color);
	font-size: 24px;
	margin-left: 10px;	
`;

const Content = styled.p`
	font-size: 18px;
	margin-right: 10px;
	margin-bottom: 15px;
	margin-left: 10px;
	`;

const KycAudit = () => {
	return (
		<Area_info>
			<Title>Audit & KYC</Title>
			<SubTitle>Pre-sale Audit and Badge</SubTitle>
			<Content>
				At BaseDex.Ai, we collaborate with a range of approved auditors to meticulously analyze project code for potential vulnerabilities and malicious intentions. Our goal is to instill confidence in the launches of projects on our platform. By leveraging state-of-the-art manual security checks and AI-driven technology, we ensure the security and integrity of blockchains, smart contracts, and Web3 applications for our clients. By obtaining an audit badge for your launch, you demonstrate that your contract has been thoroughly assessed by one of our trusted partners. Contact our team on Telegram to begin the process.
			</Content>
			<SubTitle>Exclusive KYC for Project Owners</SubTitle>
			<Content>
				BaseDex.Ai is committed to combating scams and rugpulls. To that end, we have developed a suite of features and tools designed to help you make informed decisions about the potential value and legitimacy of presale investments.
			</Content>
			<SubTitle>Understanding KYC</SubTitle>
			<Content>
				Know Your Customer (KYC) is an identity verification process used to confirm that individuals are who they claim to be. Project owners must submit ID documentation (such as a passport or national ID) to an automated platform. This process is comparable to the KYC procedure required when opening a trading account with a major exchange like Binance.
			</Content>
			<SubTitle>Implications for Users</SubTitle>
			<Content>
				The KYC process serves as a deterrent for malicious developers, striving to eliminate scams and rugpulls from our platform. If any team members from a KYC-verified project engage in fraudulent
			</Content>
			<Content>
				- We will disclose their identities.<br/>
				- We will make this information publicly available to those who wish to pursue legal action.
			</Content>
			<Content>
				For investors: If you have serious concerns about a project and can provide evidence that it is a scam, please contact us immediately with as much supporting information as possible. We will conduct an investigation and inform you of our findings. 
			</Content>
			<Content>
				For project owners: To establish trust with investors, we highly recommend contacting our Telegram KYC team to apply for KYC verification. This process lends credibility to your project. Please note that KYC approval may take 24-48 hours, so reach out as soon as possible.
			</Content>
			<SubTitle>Refund Policy</SubTitle>
			<Content>
				This statement outlines all instructions and requirements for successful KYC completion. If you disagree with these terms, please do not submit payment. By proceeding with the KYC processing fee payment, you acknowledge that you are not entitled to a refund under any circumstances.
			</Content>
			<Content>
				In particular, we emphasize the importance of honesty throughout the process. You must use your actual documents, legal name, and accurate role in the project. Failure to do so will result in immediate KYC cancellation without a refund.
			</Content>
			<SubTitle>Important Disclaimer</SubTitle>
			<Content>
				A project receiving the KYC badge does not imply our endorsement or recommendation. Even if we host an AMA with the project, it is crucial to conduct your own research (DYOR) before investing. Remember that BaseDex.Ai is a decentralized platform.
			</Content>
		</Area_info>
	);
};

export default KycAudit;


