use anchor_lang::prelude::*;

declare_id!("HRqUrh12DaapFSP1sT7ezuTsFNfVqDqKfTCd6mmBsYqN");

const ANCHOR_DISCRIMINATOR: usize = 8;
const MAX_TOTAL_AMOUNT:usize = 10;
const MAX_ITEMS:usize = 5;

#[program]
pub mod bill_tx {
    use super::*;

    pub fn create_bill(
        ctx: Context<CreateBill>,
        bill_ref_id: String,
        total_amount: String,
        items: Vec<String>,
        is_payment_done: bool,
    ) -> Result<()> {

        require!(total_amount.len() <= MAX_TOTAL_AMOUNT, BillError::TotalAmountTooLong);
        require!(items.len() <= MAX_ITEMS, BillError::ListOfItemsTooLong);
        
        let bill = &mut ctx.accounts.bill;

        bill.owner = ctx.accounts.owner.key();
        bill.bill_ref_id = bill_ref_id;
        bill.total_amount = total_amount;
        bill.items = items;
        bill.is_payment_done = is_payment_done;

        Ok(())
    }

    pub fn update_bill(
        ctx: Context<UpdateBill>,
        _bill_ref_id: String,
        total_amount: String,
        items: Vec<String>,
        is_payment_done: bool,
    ) -> Result<()> {
        
        let bill = &mut ctx.accounts.bill;

        bill.total_amount = total_amount;
        bill.items = items;
        bill.is_payment_done = is_payment_done;

        Ok(())
    }

    pub fn delete_bill(
        _ctx: Context<DeleteBill>,
        _bill_ref_id: String,
        total_amount: String
    ) -> Result<()> {
        msg!("The Bill of Amount {} has been Deleted", total_amount);
        Ok(())
    }
}

#[error_code]
enum BillError {
    #[msg("Too many Items")]
    ListOfItemsTooLong,
    #[msg("Amount Of Bill Too long")]
    TotalAmountTooLong,
}

#[account]
#[derive(InitSpace)]
pub struct BillingState {
    pub owner: Pubkey,
    #[max_len(10)]
    pub bill_ref_id: String,
    #[max_len(10)]
    pub total_amount: String,
    #[max_len(5, 30)]
    pub items: Vec<String>,
    pub is_payment_done: bool,
    // pub paid_by: Pubkey
}

#[derive(Accounts)]
#[instruction(bill_ref_id:String, total_amount: String, items: Vec<String>, is_payment_done: bool)]
pub struct CreateBill<'info> {
    #[account(
        init,
        payer = owner,
        space = ANCHOR_DISCRIMINATOR + BillingState::INIT_SPACE, 
        seeds = [bill_ref_id.as_bytes(), owner.key().as_ref()], 
        bump
    )]
    pub bill: Account<'info, BillingState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
#[instruction(bill_ref_id:String)]
pub struct UpdateBill<'info> {
    #[account(
        mut,
        seeds = [bill_ref_id.as_bytes(), owner.key().as_ref()], 
        bump,
        realloc=ANCHOR_DISCRIMINATOR + BillingState::INIT_SPACE,
        realloc::payer = owner,
        realloc::zero = false,
    )]
    pub bill: Account<'info, BillingState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
#[instruction(bill_ref_id:String)]
pub struct DeleteBill<'info> {
    #[account(
        mut,
        seeds = [bill_ref_id.as_bytes(), owner.key().as_ref()],
        bump,
        close = owner
    )]
    pub bill: Account<'info, BillingState>,
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>
}
