use anchor_lang::prelude::*;

declare_id!("HRqUrh12DaapFSP1sT7ezuTsFNfVqDqKfTCd6mmBsYqN");

#[program]
pub mod basic {
    use super::*;

    pub fn greet(_ctx: Context<Initialize>) -> Result<()> {
        msg!("GM!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
