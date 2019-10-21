<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:n="urn:com-cerner-patient-ehr:v3"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
	xmlns:doc="java:com.cerner.documentation.extension.XSLTFuncs"
	xmlns:dd="DynamicDocumentation"
	xmlns:java-string="java:java.lang.String"
	exclude-result-prefixes="xsl xs n doc dd cdocfx java-string">

	<xsl:output method="html" encoding="UTF-8" indent="yes"/>

	<xsl:param as="xs:string" name="current-locale" select="'en_US'"/>

	<!-- required to include CommonFxn.xslt -->
	<!-- Comment this line to debug --> <xsl:include href="/cernerbasiccontent/formats/commonfxn.xslt" />
	<!-- Uncomment this line to debug <xsl:include href="commonfxn.xslt" /> -->

	<!-- Default string constants -->
	<xsl:variable name="What" as="xs:string">
		<xsl:value-of select="'What'"/>
	</xsl:variable>

	<xsl:variable name="HowMuch" as="xs:string">
		<xsl:value-of select="'How much'"/>
	</xsl:variable>

	<xsl:variable name="How" as="xs:string">
		<xsl:value-of select="'How'"/>
	</xsl:variable>

	<xsl:variable name="When" as="xs:string">
		<xsl:value-of select="'When'"/>
	</xsl:variable>

	<xsl:variable name="Why" as="xs:string">
		<xsl:value-of select="'Why'"/>
	</xsl:variable>

	<xsl:variable name="AsNeeded" as="xs:string">
		<xsl:value-of select="'as needed'"/>
	</xsl:variable>

	<xsl:variable name="Instructions" as="xs:string">
		<xsl:value-of select="'Instructions'"/>
	</xsl:variable>

	<xsl:variable name="Duration" as="xs:string">
		<xsl:value-of select="'Duration: '"/>
	</xsl:variable>

	<xsl:variable name="Comments" as="xs:string">
		<xsl:value-of select="'Comments'"/>
	</xsl:variable>

	<xsl:variable name="Pickup" as="xs:string">
		<xsl:value-of select="'Pickup at'"/>
	</xsl:variable>

	<xsl:variable name="Refills" as="xs:string">
		<xsl:value-of select="'Refills:'"/>
	</xsl:variable>

	<xsl:variable name="New" as="xs:string">
		<xsl:value-of select="'New'"/>
	</xsl:variable>

	<xsl:variable name="Changed" as="xs:string">
		<xsl:value-of select="'Changed'"/>
	</xsl:variable>

	<xsl:variable name="Unchanged" as="xs:string">
		<xsl:value-of select="'Unchanged'"/>
	</xsl:variable>

	<xsl:variable name="NextLastDose" as="xs:string">
		<xsl:value-of select="'Next Dose'"/>
	</xsl:variable>
	
	<xsl:variable name="ShowNextDose" as="xs:boolean">
		<xsl:value-of select="false()"/>
	</xsl:variable>

	<xsl:variable name="StopTaking" as="xs:string">
		<xsl:value-of select="'Stop taking'"/>
	</xsl:variable>

	<xsl:variable name="ContactPhysician" as="xs:string">
		<xsl:value-of select="'Contact prescribing physician if questions or concerns'"/>
	</xsl:variable>

	<xsl:variable name="Connector" as="xs:string">
		<xsl:value-of select="'%s %s'"/>
	</xsl:variable>

	<xsl:variable name="PharmacyConnector" as="xs:string">
		<xsl:value-of select="'%s: %s %s'"/>
	</xsl:variable>

	<!-- Displays Frequency followed by PRN. -->
	<!-- Swap placeholders to display PRN followed by Frequency -->
	<xsl:variable name="FreqPRNConnector" as="xs:string">
		<xsl:value-of select="'%1$s as needed for %2$s'"/>
	</xsl:variable>

	<!-- Used to display either of PRN Reason or PRN Instructions -->
	<xsl:variable name="PRNConnector" as="xs:string">
		<xsl:value-of select="'as needed for %1$s'"/>
	</xsl:variable>

	<xsl:variable name="SeeInstructions" as="xs:string">
		<xsl:value-of select="'See instructions'"/>
	</xsl:variable>

	<xsl:variable name="Printed" as="xs:string">
		<xsl:value-of select="'Printed Prescription'"/>
	</xsl:variable>

	<!-- Capitalize first letter of input string. -->
	<xsl:function name="cdocfx:upper-first-char" as="xs:string">
		<xsl:param name="string" />
		<xsl:value-of select="concat(upper-case(substring($string, 1, 1)),substring($string, 2))" />
	</xsl:function>

	<xsl:variable name="CharacterLimit" as="xs:integer">
		<xsl:value-of select="40"/>
	</xsl:variable>

	<!-- Meds NOT to stop will be displayed in a table. Meds to stop will be displayed in another table. -->
	<!-- The following variables check to see if each column needs to be shown in the NOT to stop meds table. -->
	<xsl:variable name="ShowHowMuchColNonStop" as="xs:boolean">
		<xsl:choose>
			<xsl:when test="n:report/n:clinical-data/n:reconciliation-report-data/n:reconciliation-report-order[@report-order-type!='STOP' and @detail-line-dose-type='SPECIAL_INSTRUCTIONS']">
				<xsl:value-of select="true()"/> <!-- At least a SPECIAL_INSTRUCTIONS med exists -->
			</xsl:when>
			<xsl:when test="n:report/n:clinical-data/n:reconciliation-report-data/n:reconciliation-report-order[@report-order-type!='STOP']/n:report-order-detail[@detail-field-meaning='FREETEXT_DOSE']">
				<xsl:value-of select="true()"/> <!-- At least a med with a free text dose exists -->
			</xsl:when>
			<xsl:when test="n:report/n:clinical-data/n:reconciliation-report-data/n:reconciliation-report-order[@report-order-type!='STOP']/n:report-order-detail[@detail-field-meaning='VOLUME_DOSE']">
				<xsl:value-of select="true()"/> <!-- At least a med with a volume dose exists -->
			</xsl:when>
			<xsl:when test="n:report/n:clinical-data/n:reconciliation-report-data/n:reconciliation-report-order[@report-order-type!='STOP']/n:report-order-detail[@detail-field-meaning='STRENGTH_DOSE']">
				<xsl:value-of select="true()"/> <!-- At least a med with a strength dose exists -->
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="false()"/> <!-- There's nothing to show in the How Much column -->
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

	<xsl:variable name="ShowHowColNonStop" as="xs:boolean">
		<xsl:choose>
			<xsl:when test="n:report/n:clinical-data/n:reconciliation-report-data/n:reconciliation-report-order[@report-order-type!='STOP' and @detail-line-dose-type='SPECIAL_INSTRUCTIONS']">
				<xsl:value-of select="true()"/> <!-- At least a SPECIAL_INSTRUCTIONS med exists -->
			</xsl:when>
			<xsl:when test="n:report/n:clinical-data/n:reconciliation-report-data/n:reconciliation-report-order[@report-order-type!='STOP']/n:report-order-detail[@detail-field-meaning='ROUTE_OF_ADMINISTRATION']">
				<xsl:value-of select="true()"/> <!-- At least a med has route-of-taking information -->
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="false()"/> <!-- There's nothing to show in the How column -->
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

	<xsl:variable name="ShowWhyColNonStop" as="xs:boolean">
		<xsl:choose>
			<xsl:when test="n:report/n:clinical-data/n:reconciliation-report-data/n:reconciliation-report-order[@report-order-type!='STOP']/n:diagnoses/n:diagnosis">
				<xsl:value-of select="true()"/> <!-- At least a med has one or more associated diagnoses -->
			</xsl:when>
			<xsl:when test="n:report/n:clinical-data/n:reconciliation-report-data/n:reconciliation-report-order[@report-order-type!='STOP']/@order-indication">
				<xsl:value-of select="true()"/> <!-- At least a med has order indication -->
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="false()"/> <!-- There's nothing to show in the Why column -->
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

	<!-- The following variables check to see if each column needs to be shown in the stop taking meds table. -->
	<xsl:variable name="ShowHowMuchColStopTaking" as="xs:boolean">
		<xsl:choose>
			<xsl:when test="n:report/n:clinical-data/n:reconciliation-report-data/n:reconciliation-report-order[@report-order-type='STOP' and @detail-line-dose-type='SPECIAL_INSTRUCTIONS']">
				<xsl:value-of select="true()"/> <!-- At least a SPECIAL_INSTRUCTIONS med exists -->
			</xsl:when>
			<xsl:when test="n:report/n:clinical-data/n:reconciliation-report-data/n:reconciliation-report-order[@report-order-type='STOP']/n:report-order-detail[@detail-field-meaning='FREETEXT_DOSE']">
				<xsl:value-of select="true()"/> <!-- At least a med with a free text dose exists -->
			</xsl:when>
			<xsl:when test="n:report/n:clinical-data/n:reconciliation-report-data/n:reconciliation-report-order[@report-order-type='STOP']/n:report-order-detail[@detail-field-meaning='VOLUME_DOSE']">
				<xsl:value-of select="true()"/> <!-- At least a med with a volume dose exists -->
			</xsl:when>
			<xsl:when test="n:report/n:clinical-data/n:reconciliation-report-data/n:reconciliation-report-order[@report-order-type='STOP']/n:report-order-detail[@detail-field-meaning='STRENGTH_DOSE']">
				<xsl:value-of select="true()"/> <!-- At least a med with a strength dose exists -->
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="false()"/> <!-- There's nothing to show in the How Much column -->
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

	<xsl:variable name="ShowHowColStopTaking" as="xs:boolean">
		<xsl:choose>
			<xsl:when test="n:report/n:clinical-data/n:reconciliation-report-data/n:reconciliation-report-order[@report-order-type='STOP' and @detail-line-dose-type='SPECIAL_INSTRUCTIONS']">
				<xsl:value-of select="true()"/> <!-- At least a SPECIAL_INSTRUCTIONS med exists -->
			</xsl:when>
			<xsl:when test="n:report/n:clinical-data/n:reconciliation-report-data/n:reconciliation-report-order[@report-order-type='STOP']/n:report-order-detail[@detail-field-meaning='ROUTE_OF_ADMINISTRATION']">
				<xsl:value-of select="true()"/> <!-- At least a med has route-of-taking information -->
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="false()"/> <!-- There's nothing to show in the How column -->
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

	<xsl:variable name="ShowWhyColStopTaking" as="xs:boolean">
		<xsl:choose>
			<xsl:when test="n:report/n:clinical-data/n:reconciliation-report-data/n:reconciliation-report-order[@report-order-type='STOP']/n:diagnoses/n:diagnosis">
				<xsl:value-of select="true()"/> <!-- At least a med has one or more associated diagnoses -->
			</xsl:when>
			<xsl:when test="n:report/n:clinical-data/n:reconciliation-report-data/n:reconciliation-report-order[@report-order-type='STOP']/@order-indication">
				<xsl:value-of select="true()"/> <!-- At least a med has order indication -->
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="false()"/> <!-- There's nothing to show in the Why column -->
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

	<xsl:template match="/">

		<!-- Create a list of all Unique Pharmacies to be displayed as a footnote for New/Continue MedsRec table  -->
		<xsl:variable name="UniquePharmacies">
			<xsl:for-each-group select="n:report/n:clinical-data/n:reconciliation-report-data/n:reconciliation-report-order[@report-order-type!='STOP']/n:routing-information/n:pharmacy" group-by="./n:name/text()">
				<xsl:for-each-group select="current-group()" group-by="concat(./n:address/text(),./n:telephone/text())">
					<pharmacy>
						<xsl:attribute name="name" select="./n:name"></xsl:attribute>
						<xsl:attribute name="address" select="./n:address"></xsl:attribute>
						<xsl:attribute name="telephone" select="./n:telephone"></xsl:attribute>
					</pharmacy>
				</xsl:for-each-group>
			</xsl:for-each-group>
		</xsl:variable>

		<!-- Table of meds NOT to stop taking -->
		<!-- Note: max-width is specified directly on th and td, for html to display fine, and for various downstream conversions to work fine.
             If max-width is only specified on th, or if a colgroup is used instead, the display can be unexpected, and the PDF conversion does not handle those well. -->
		<xsl:if test="n:report/n:clinical-data/n:reconciliation-report-data/n:reconciliation-report-order[@report-order-type!='STOP']">

			<table style="table-layout:fixed; border:1px solid #000; border-collapse:collapse;" dd:zebrastripecolor="#F4F4F4" dd:zebraheadercolor="#F4F4F4" dd:whitespacecolseparator="true"> <!-- Separate columns by a space in plain text conversion -->
				<thead style="display:table-header-group;"> <!-- This thead will repeat table heading on each page when printing on paper such as Draft Print -->
					<tr>
						<th style="width:100px; border-bottom: 1px solid #000;"/> <!-- This column only shows the medication status. This column does not have a column heading, so this th element is empty. -->
						
						<th style="max-width:20%; vertical-align:top; text-align:center; padding:0 5px; border-bottom: 1px solid #000; border-left:1px solid #000; border-right:1px solid #000; font-weight:bold;"><xsl:value-of select="$What"/></th>
						
						<xsl:if test="$ShowHowMuchColNonStop or $ShowHowColNonStop">
							<th style="max-width:10%; vertical-align:top; text-align:center; padding:0 5px; border-bottom: 1px solid #000; border-left:1px solid #000; border-right:1px solid #000; font-weight:bold;">
								<xsl:value-of select="$HowMuch"/>
							</th>
						</xsl:if>
						
						<th style="max-width:10%; vertical-align:top; text-align:center; padding:0 5px; border-bottom: 1px solid #000; border-left:1px solid #000; border-right:1px solid #000; font-weight:bold;">
							<xsl:value-of select="$When"/>
						</th>
						
						<xsl:if test="$ShowWhyColNonStop">
							<th style="max-width:10%; vertical-align:top; text-align:center; padding:0 5px; border-bottom: 1px solid #000; border-left:1px solid #000; border-right:1px solid #000; font-weight:bold;">
								<xsl:value-of select="$Why"/>
							</th>
						</xsl:if>
						
						<th style="max-width:20%; vertical-align:top; text-align:center; padding:0 5px; border-bottom: 1px solid #000; border-left:1px solid #000; border-right:1px solid #000; font-weight:bold;">
							<xsl:value-of select="$Instructions"/>
						</th>
						
						<xsl:if test="$ShowNextDose">
							<th style="max-width:10%; vertical-align:top; text-align:center; padding:0 5px; border-bottom: 1px solid #000; border-left:1px solid #000; border-right:1px solid #000; font-weight:bold;">
								<xsl:value-of select="$NextLastDose"/>
							</th>
						</xsl:if>
					</tr>
				</thead>
				<tbody>
					<!-- New -->
					<xsl:for-each select="n:report/n:clinical-data/n:reconciliation-report-data/n:reconciliation-report-order[@report-order-type='FILL']">
						<xsl:call-template name="DisplayMed">
							<xsl:with-param name="Med" select="."/>
							<xsl:with-param name="ShowHowMuchCol" select="$ShowHowMuchColNonStop"/>
							<xsl:with-param name="ShowWhyCol" select="$ShowWhyColNonStop"/>
							<xsl:with-param name="ShowNextLast" select="$ShowNextDose"/>
							<xsl:with-param name="UniquePharmacies" select="$UniquePharmacies"/>
						</xsl:call-template>
					</xsl:for-each>

					<!-- Changed -->
					<xsl:for-each select="n:report/n:clinical-data/n:reconciliation-report-data/n:reconciliation-report-order[@report-order-type='CONTINUE_WITH_CHANGES']">
						<xsl:call-template name="DisplayMed">
							<xsl:with-param name="Med" select="."/>
							<xsl:with-param name="ShowHowMuchCol" select="$ShowHowMuchColNonStop"/>
							<xsl:with-param name="ShowWhyCol" select="$ShowWhyColNonStop"/>
							<xsl:with-param name="ShowNextLast" select="$ShowNextDose"/>
							<xsl:with-param name="UniquePharmacies" select="$UniquePharmacies"/>
						</xsl:call-template>
					</xsl:for-each>

					<!-- Unchanged or Contact physician -->
					<xsl:for-each select="n:report/n:clinical-data/n:reconciliation-report-data/n:reconciliation-report-order[@report-order-type='CONTINUE' or @report-order-type='CONTACT_PHYSICIAN']">
						<xsl:call-template name="DisplayMed">
							<xsl:with-param name="Med" select="."/>
							<xsl:with-param name="ShowHowMuchCol" select="$ShowHowMuchColNonStop"/>
							<xsl:with-param name="ShowWhyCol" select="$ShowWhyColNonStop"/>
							<xsl:with-param name="ShowNextLast" select="$ShowNextDose"/>
							<xsl:with-param name="UniquePharmacies" select="$UniquePharmacies"/>
						</xsl:call-template>
					</xsl:for-each>
				</tbody>
			</table>

			<!-- List of Pharmacies displayed after a Medication Reconciliation NOT STOP table. -->
			<xsl:if test="$UniquePharmacies/pharmacy">
				<div><b>Pharmacy Information </b></div>
				<xsl:for-each select="$UniquePharmacies/pharmacy">
					<div style="text-indent: -1em; padding-left: 1em;">
						<xsl:variable name="Name" as="xs:string">
							<xsl:choose>
								<xsl:when test="@name">
									<xsl:value-of select="@name"/>
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="''"/>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:variable>
	
						<xsl:variable name="Address" as="xs:string">
							<xsl:choose>
								<xsl:when test="@address">
									<xsl:value-of select="@address"/>
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="''"/>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:variable>
	
						<xsl:variable name="Telephone" as="xs:string">
							<xsl:choose>
								<xsl:when test="@telephone">
									<xsl:value-of select="@telephone"/>
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="''"/>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:variable>
						<xsl:value-of select="java-string:format($PharmacyConnector, ($Name, $Address, $Telephone))"></xsl:value-of>
					</div>
				</xsl:for-each>
			</xsl:if>
		</xsl:if>

		<!-- Table of meds to stop taking -->
		<xsl:if test="n:report/n:clinical-data/n:reconciliation-report-data/n:reconciliation-report-order[@report-order-type='STOP']">

			<!-- Add line break between the tables if both tables exist. -->
			<xsl:if test="n:report/n:clinical-data/n:reconciliation-report-data/n:reconciliation-report-order[@report-order-type!='STOP']">
				<br/>
				<br/>
			</xsl:if>

			<table style="border:1px solid #000; border-collapse:collapse;" dd:zebrastripecolor="#F4F4F4" dd:zebraheadercolor="#F4F4F4" dd:whitespacecolseparator="true"> <!-- Separate columns by a space in plain text conversion -->
				<thead style="display:table-header-group;"> <!-- This thead will repeat table heading on each page when printing on paper such as Draft Print -->
					<tr>
						<th style="width:100px; border-bottom: 1px solid #000;"/> <!-- This column only shows the medication status. This column does not have a column heading, so this th element is empty. -->
					
						<th style="width:200px; vertical-align:top; text-align:center; padding:0 5px; border-bottom: 1px solid #000; border-left:1px solid #000; border-right:1px solid #000; font-weight:bold;"><xsl:value-of select="$What"/></th>
						
						<xsl:if test="$ShowHowMuchColStopTaking">
							<th style="max-width:200px; vertical-align:top; text-align:center; padding:0 5px; border-bottom: 1px solid #000; border-left:1px solid #000; border-right:1px solid #000; font-weight:bold;"><xsl:value-of select="$HowMuch"/></th>
						</xsl:if>
						<th style="max-width:200px; vertical-align:top; text-align:center; padding:0 5px; border-bottom: 1px solid #000; border-left:1px solid #000; border-right:1px solid #000; font-weight:bold;"><xsl:value-of select="$When"/></th>
						
						<xsl:if test="$ShowWhyColStopTaking">
							<th style="max-width:200px; vertical-align:top; text-align:center; padding:0 5px; border-bottom: 1px solid #000; border-left:1px solid #000; border-right:1px solid #000; font-weight:bold;"><xsl:value-of select="$Why"/></th>
						</xsl:if>
						
						<th style="vertical-align:top; text-align:center; padding:0 5px; border-bottom: 1px solid #000; border-left:1px solid #000; border-right:1px solid #000; font-weight:bold;"><xsl:value-of select="$Comments"/></th>
					</tr>
				</thead>
				<tbody>
					<!-- Stop Taking -->
					<xsl:for-each select="n:report/n:clinical-data/n:reconciliation-report-data/n:reconciliation-report-order[@report-order-type='STOP']">
						<xsl:call-template name="DisplayMed">
							<xsl:with-param name="Med" select="."/>
							<xsl:with-param name="ShowHowMuchCol" select="$ShowHowMuchColStopTaking"/>
							<xsl:with-param name="ShowWhyCol" select="$ShowWhyColStopTaking"/>
							<xsl:with-param name="ShowNextLast" select="false()"/>
							<xsl:with-param name="UniquePharmacies" select="$UniquePharmacies"/>
						</xsl:call-template>
					</xsl:for-each>
				</tbody>
			</table>

		</xsl:if>

	</xsl:template>

	<xsl:template name="DisplayMed">
		<xsl:param name="Med"/>
		<xsl:param name="ShowHowMuchCol"/>
		<xsl:param name="ShowWhyCol"/>
		<xsl:param name="ShowNextLast"/>
		<xsl:param name="UniquePharmacies"/>

		<xsl:variable name="IsSpecialInstruction" as="xs:boolean">
			<xsl:value-of select="$Med/@detail-line-dose-type='SPECIAL_INSTRUCTIONS'"/>
		</xsl:variable>

		<tr class="ddemrcontentitem ddremovable" style="border-top: 1px solid #000; page-break-inside: avoid;" dd:btnfloatingstyle="top-right">
			<xsl:attribute name="dd:entityid">
				<xsl:if test="$Med/@order-id">
					<xsl:value-of select="$Med/@order-id"/>
				</xsl:if>
			</xsl:attribute>
			<xsl:attribute name="dd:contenttype">
				<xsl:text>MEDS_REC</xsl:text>
			</xsl:attribute>

			<td style="vertical-align:top; padding:0 5px; border-left:1px solid #000; border-right:1px solid #000;">
				<!-- Status -->
				<xsl:call-template name="DisplayStatus">
					<xsl:with-param name="Status" select="$Med/@report-order-type"/> <!-- @report-order-type is a required field. -->
				</xsl:call-template>
			</td>

			<xsl:variable name="WordWrapBreak" as="xs:boolean">
				<xsl:call-template name="containsLongString">
					<xsl:with-param name="count" select="0"></xsl:with-param>
					<xsl:with-param name="StringToEvaluate" select="$Med/@order-name"></xsl:with-param>
					<xsl:with-param name="CharacterLimit" select="$CharacterLimit"></xsl:with-param>
				</xsl:call-template>
			</xsl:variable>
			<xsl:choose>
				<xsl:when test="$WordWrapBreak = true()">
					<td style="vertical-align:top; word-break: break-all; padding:0 5px; border-left:1px solid #000; border-right:1px solid #000;">
						<!-- Med name -->
						<xsl:if test="$Med/@order-name">
							<xsl:value-of select="cdocfx:space-after-slash($Med/@order-name)"/>
						</xsl:if>
					</td>
				</xsl:when>
				<xsl:otherwise>
					<td style="vertical-align:top; padding:0 5px; border-left:1px solid #000; border-right:1px solid #000;">
				<!-- Med name -->
				<xsl:if test="$Med/@order-name">
									<xsl:value-of select="cdocfx:space-after-slash($Med/@order-name)"/>
				</xsl:if>
			</td>
				</xsl:otherwise>
			</xsl:choose>
			<xsl:if test="$IsSpecialInstruction">
				<td colspan="2" style="text-align:center; padding:0 5px; border-left:1px solid #000; border-right:1px solid #000;">
					<xsl:value-of select="$SeeInstructions"/>
				</td>
			</xsl:if>

			<xsl:if test="$ShowHowMuchCol and not($IsSpecialInstruction)">
				<td style="vertical-align:top; padding:0 5px; border-left:1px solid #000; border-right:1px solid #000;">

					<!-- Check if detail-line-dose-type indicate "VOLUME" if so, display medication dosage in VOLUME unit in "How Much" column in Medication table -->
					<xsl:variable name="IsVolumeDose" as="xs:boolean">
						<xsl:value-of select="$Med/@detail-line-dose-type='VOLUME'"/>
					</xsl:variable>
					
					<!-- Check if detail-line-dose-type indicate "STRENGTH" if so, display medication dosage in STRENGTH unit in "How Much" column in Medication table -->
					<xsl:variable name="IsStrengthDose" as="xs:boolean">
						<xsl:value-of select="$Med/@detail-line-dose-type='STRENGTH'"/>
					</xsl:variable>
					<xsl:variable name="VolumeDoseNum" as="xs:string">
						<xsl:choose>
							<xsl:when test="$Med/n:report-order-detail[@detail-field-meaning='VOLUME_DOSE']">
								<xsl:call-template name="GetReportOrderDetail">
									<xsl:with-param name="ReportOrderDetail" select="$Med/n:report-order-detail[@detail-field-meaning='VOLUME_DOSE']"/>
								</xsl:call-template>
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="''"/>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:variable>

					<xsl:variable name="StrengthDoseNum" as="xs:string">
						<xsl:choose>
							<xsl:when test="$Med/n:report-order-detail[@detail-field-meaning='STRENGTH_DOSE']">
								<xsl:call-template name="GetReportOrderDetail">
									<xsl:with-param name="ReportOrderDetail" select="$Med/n:report-order-detail[@detail-field-meaning='STRENGTH_DOSE']"/>
								</xsl:call-template>
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="''"/>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:variable>

					<xsl:variable name="VolumeDoseUnit" as="xs:string">
						<xsl:choose>
							<xsl:when test="$Med/n:report-order-detail[@detail-field-meaning='VOLUME_DOSE_UNIT']">
								<xsl:call-template name="GetReportOrderDetail">
									<xsl:with-param name="ReportOrderDetail" select="$Med/n:report-order-detail[@detail-field-meaning='VOLUME_DOSE_UNIT']"/>
								</xsl:call-template>
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="''"/>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:variable>

					<xsl:variable name="StrengthDoseUnit" as="xs:string">
						<xsl:choose>
							<xsl:when test="$Med/n:report-order-detail[@detail-field-meaning='STRENGTH_DOSE_UNIT']">
								<xsl:call-template name="GetReportOrderDetail">
									<xsl:with-param name="ReportOrderDetail" select="$Med/n:report-order-detail[@detail-field-meaning='STRENGTH_DOSE_UNIT']"/>
								</xsl:call-template>
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="''"/>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:variable>
					
					<xsl:choose>
						<xsl:when test="$Med/@detail-line-dose-type='SPECIAL_INSTRUCTIONS'">
							<xsl:value-of select="$SeeInstructions"/>
						</xsl:when>
						<xsl:when test="$IsVolumeDose and $VolumeDoseNum!=''">
							<xsl:value-of select="java-string:format($Connector, ($VolumeDoseNum, $VolumeDoseUnit))"/>
						</xsl:when>
						<xsl:when test="$IsStrengthDose and $StrengthDoseNum!=''" >
							<xsl:value-of select="java-string:format($Connector, ($StrengthDoseNum, $StrengthDoseUnit))"/>
						</xsl:when>
						<xsl:when test="$StrengthDoseNum!=''">
							<xsl:value-of select="java-string:format($Connector, ($StrengthDoseNum, $StrengthDoseUnit))"/>
						</xsl:when>
						<xsl:when test="$VolumeDoseNum!=''">
							<xsl:value-of select="java-string:format($Connector, ($VolumeDoseNum, $VolumeDoseUnit))"/>
						</xsl:when>
						<xsl:when test="$Med/n:report-order-detail[@detail-field-meaning='FREETEXT_DOSE']">
							<xsl:call-template name="GetReportOrderDetail">
								<xsl:with-param name="ReportOrderDetail" select="$Med/n:report-order-detail[@detail-field-meaning='FREETEXT_DOSE']"/>
							</xsl:call-template>
						</xsl:when>
					</xsl:choose>
					<xsl:if test="$Med/n:report-order-detail[@detail-field-meaning='ROUTE_OF_ADMINISTRATION']">
						<div>
							<xsl:call-template name="GetReportOrderDetail">
								<xsl:with-param name="ReportOrderDetail" select="$Med/n:report-order-detail[@detail-field-meaning='ROUTE_OF_ADMINISTRATION']"/>
							</xsl:call-template>
						</div>
					</xsl:if>
				</td>
			</xsl:if>

			<!-- PRN variables for use in the next table cell -->
			<xsl:variable name="PRNIndicator" as="xs:string">
				<xsl:choose>
					<xsl:when test="$Med/n:report-order-detail[@detail-field-meaning='PRN_INDICATOR']">
						<xsl:value-of select="$Med/n:report-order-detail[@detail-field-meaning='PRN_INDICATOR']/n:detail-indicator-value"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="''"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:variable>

			<xsl:variable name="PRNReason" as="xs:string">
				<xsl:choose>
					<xsl:when test="$Med/n:report-order-detail[@detail-field-meaning='PRN_REASON']">
						<xsl:call-template name="GetReportOrderDetail">
							<xsl:with-param name="ReportOrderDetail" select="$Med/n:report-order-detail[@detail-field-meaning='PRN_REASON']"/>
						</xsl:call-template>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="''"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:variable>

			<xsl:variable name="PRNInstructions" as="xs:string">
				<xsl:choose>
					<xsl:when test="$Med/n:report-order-detail[@detail-field-meaning='PRN_INSTRUCTIONS']">
						<xsl:call-template name="GetReportOrderDetail">
							<xsl:with-param name="ReportOrderDetail" select="$Med/n:report-order-detail[@detail-field-meaning='PRN_INSTRUCTIONS']"/>
						</xsl:call-template>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="''"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:variable>

			<xsl:if test="not($IsSpecialInstruction)">
				<td style="vertical-align:top; padding:0 5px; border-left:1px solid #000; border-right:1px solid #000;">
				<xsl:choose>
					<!-- If @detail-line-dose-type is SPECIAL_INSTRUCTIONS, we will just show See Instructions -->
					<xsl:when test="$Med/@detail-line-dose-type='SPECIAL_INSTRUCTIONS'">
						<xsl:value-of select="$SeeInstructions"/>
					</xsl:when>
					<!-- Otherwise we show frequency and PRN -->
					<xsl:otherwise>
						<xsl:variable name="FreqDescription" as="xs:string">
							<xsl:choose>
								<xsl:when test="$Med/n:report-order-detail[@detail-field-meaning='FREQUENCY']">
									<xsl:call-template name="GetReportOrderDetail">
										<xsl:with-param name="ReportOrderDetail" select="$Med/n:report-order-detail[@detail-field-meaning='FREQUENCY']" />
									</xsl:call-template>
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="''" />
								</xsl:otherwise>
							</xsl:choose>
						</xsl:variable>

						<!-- Form the PRN Description string if PRNIndicator is set to true -->
						<!-- Set it to empty otherwise-->
						<xsl:variable name="PRNDescription" as="xs:string">
							<xsl:choose>
								<!-- If PRN indicator is not true, then select empty. -->
								<!-- If PRN indicator is true, and both PRN reason and PRN instructions are empty, select empty -->
								<!-- If PRN indicator is true, PRN reason has something, but PRN Instructions is empty, then select PRN reason -->
								<!-- If PRN indicator is true, and PRN instructions has something, select PRN instructions (there will not be a separate PRN reason in this case). -->
								<!-- If PRN indicator is true, and both PRN reason and PRN instructions are non empty, select "PRN reason PRN instructions" -->
								<xsl:when test="java-string:trim($PRNIndicator)='true'">
									<xsl:choose>
										<xsl:when test="$PRNReason='' and $PRNInstructions=''">
											<xsl:value-of select="''"/>
										</xsl:when>
										<xsl:when test="$PRNReason!='' and $PRNInstructions=''">
											<xsl:value-of select="$PRNReason"/>
										</xsl:when>
										<xsl:when test="$PRNReason='' and $PRNInstructions!=''">
											<xsl:value-of select="$PRNInstructions"/>
										</xsl:when>
										<xsl:otherwise>
											<xsl:value-of select="java-string:format($Connector, ($PRNReason, $PRNInstructions))"/>
										</xsl:otherwise>
									</xsl:choose>
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="''"/>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:variable>

						<xsl:choose>
							<xsl:when test="$FreqDescription='' and $PRNDescription='' and java-string:trim($PRNIndicator)='true'">
								<div><xsl:value-of select="cdocfx:upper-first-char($AsNeeded)"/></div>
							</xsl:when>
							<xsl:when test="$FreqDescription!='' and $PRNDescription=''">
								<xsl:choose>
									<xsl:when test="$PRNIndicator='true'">
										<div><xsl:value-of select="cdocfx:upper-first-char(java-string:format($Connector, ($FreqDescription, $AsNeeded)))"/></div>
									</xsl:when>
									<xsl:otherwise>
										<div><xsl:value-of select="cdocfx:upper-first-char($FreqDescription)"/></div>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:when test="$FreqDescription='' and $PRNDescription!=''">
								<div><xsl:value-of select="cdocfx:upper-first-char(java-string:format($PRNConnector,($PRNDescription)))"/></div>
							</xsl:when>
							<xsl:when test="$FreqDescription!='' and $PRNDescription!=''">
								<div><xsl:value-of select="cdocfx:upper-first-char(java-string:format($FreqPRNConnector,($FreqDescription, $PRNDescription)))"/></div>
							</xsl:when>
						</xsl:choose>
					</xsl:otherwise>
				</xsl:choose>
				<div class="ddfreetext" dd:refreshid="when" />
			</td>
			</xsl:if>

			<xsl:if test="$ShowWhyCol">
				<td style="max-width:200px; vertical-align:top; padding:0 5px; border-left:1px solid #000; border-right:1px solid #000;">
					<!-- Diagnoses -->
					<xsl:if test="$Med/n:diagnoses/n:diagnosis">
						<xsl:for-each select="$Med/n:diagnoses/n:diagnosis">
							<div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right" style="padding-left:1em; text-indent:-1em" ><xsl:value-of select="@annotated-display"/></div>
						</xsl:for-each>
					</xsl:if>

					<!-- Order indication -->
					<xsl:variable name="OrderIndication" as="xs:string">
						<xsl:choose>
							<xsl:when test="$Med/@order-indication">
								<xsl:value-of select="$Med/@order-indication"/>
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="''"/>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:variable>

					<xsl:if test="$OrderIndication!='' and not($Med/n:diagnoses/n:diagnosis)">
						<div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right" style="padding-left:1em; text-indent:-1em"><xsl:value-of select="$OrderIndication"/></div>
					</xsl:if>

					<div class="ddfreetext" dd:refreshid="why"></div>
				</td>
			</xsl:if>

			<!-- Fetching the value of Special Instructions to be printed in the Instructions column -->
			<xsl:variable name="SpecialInstruct" as="xs:string">
				<xsl:choose>
					<xsl:when test="$Med/n:report-order-detail[@detail-field-meaning='SPECIAL_INSTRUCTIONS']">
						<xsl:call-template name="GetReportOrderDetail">
							<xsl:with-param name="ReportOrderDetail" select="$Med/n:report-order-detail[@detail-field-meaning='SPECIAL_INSTRUCTIONS']"/>
						</xsl:call-template>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="''"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:variable>
			
			<!-- WordWrapBreakInstructions will be true if Special Instruction or Patient Instruction have a long word that might cause the table print to truncate. -->
			<xsl:variable name="WordWrapBreakInstructions" as="xs:boolean">
				<xsl:call-template name="containsLongString">
					<xsl:with-param name="count" select="0"></xsl:with-param>
					<xsl:with-param name="StringToEvaluate" select="concat(cdocfx:space-after-slash($SpecialInstruct),' ', cdocfx:space-after-slash($Med/n:patient-instructions/text()))"></xsl:with-param>
					<xsl:with-param name="CharacterLimit" select="$CharacterLimit"></xsl:with-param>
				</xsl:call-template>
			</xsl:variable>
			
			<!-- If WordWrapBreakInstructions is true then we will apply word-break:break-all css property to Instructions column so that the table print do not truncate. -->
			<xsl:variable name="InstructionsCSSStyle">
				<xsl:choose>
					<xsl:when test="$WordWrapBreakInstructions"><xsl:value-of select="'vertical-align:top; padding:0 5px; border-left:1px solid #000; border-right:1px solid #000; word-break:break-all;'"/></xsl:when>
					<xsl:otherwise><xsl:value-of select="'vertical-align:top; padding:0 5px; border-left:1px solid #000; border-right:1px solid #000;'"/></xsl:otherwise>
				</xsl:choose>
			</xsl:variable>
			
			<td>
				<xsl:attribute name="style"><xsl:value-of select ="$InstructionsCSSStyle"/></xsl:attribute>

				<!-- Duration -->
				<xsl:variable name="DurationNum" as="xs:string">
					<xsl:choose>
						<xsl:when test="$Med/n:report-order-detail[@detail-field-meaning='DURATION']">
							<xsl:call-template name="GetReportOrderDetail">
								<xsl:with-param name="ReportOrderDetail" select="$Med/n:report-order-detail[@detail-field-meaning='DURATION']"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="''"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:variable>

				<xsl:variable name="DurationUnit" as="xs:string">
					<xsl:choose>
						<xsl:when test="$Med/n:report-order-detail[@detail-field-meaning='DURATION_UNIT']">
							<xsl:call-template name="GetReportOrderDetail">
								<xsl:with-param name="ReportOrderDetail" select="$Med/n:report-order-detail[@detail-field-meaning='DURATION_UNIT']"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="''"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:variable>

				<xsl:if test="$DurationNum!=''">
					<div><xsl:value-of select="$Duration"/><xsl:value-of select="java-string:format($Connector, ($DurationNum, $DurationUnit))"/></div>
				</xsl:if>

				<!-- Refills -->
				<xsl:if test="$Med/@report-order-type='FILL'">
					<xsl:variable name="NumRefills" as="xs:string">
						<xsl:choose>
							<xsl:when test="$Med/n:report-order-detail[@detail-field-meaning='NUMBER_OF_REFILLS']">
								<xsl:call-template name="GetReportOrderDetail">
									<xsl:with-param name="ReportOrderDetail" select="$Med/n:report-order-detail[@detail-field-meaning='NUMBER_OF_REFILLS']"/>
								</xsl:call-template>
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="'0'"/>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:variable>
					<xsl:if test="$NumRefills!='0'">
						<div><xsl:value-of select="java-string:format($Connector, ($Refills, $NumRefills))"/></div>
					</xsl:if>
				</xsl:if>


				<!-- Output SPECIAL_INSTRUCTIONS -->
				<xsl:if test="$SpecialInstruct!=''">
					<div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right"><xsl:value-of disable-output-escaping="yes" select="doc:convertPlainTextToHtml(cdocfx:space-after-slash($SpecialInstruct))"/></div>
				</xsl:if>

				<!-- Output @patient-instructions -->
				<xsl:if test="$Med/n:patient-instructions">
					<xsl:variable name="PatientInstructions" as="xs:string">
						<xsl:value-of select="$Med/n:patient-instructions"/>
					</xsl:variable>
					<div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right"><xsl:value-of disable-output-escaping="yes" select="doc:convertPlainTextToHtml(cdocfx:space-after-slash($PatientInstructions))"/></div>
				</xsl:if>
				
				<xsl:if test="$Med/@report-order-type = 'CONTACT_PHYSICIAN'">
					<div><xsl:value-of select="$ContactPhysician"/></div>
				</xsl:if>
				<!-- Placing some empty lines between Instructions and pharmacy information -->
				<xsl:if test="(($SpecialInstruct!='') or ($Med/n:patient-instructions) or ($Med/@report-order-type = 'CONTACT_PHYSICIAN'))">
					<br/><br/>
				</xsl:if>
				
				<xsl:if test="($Med/n:routing-information/n:pharmacy or $Med/n:routing-information/@rx-printed-indicator='1') and ($Med/@report-order-type!='STOP')" >
					<div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">
											
						<xsl:if test="$Med/n:routing-information/@rx-printed-indicator='1'">
							<xsl:value-of select="$Printed"/><br/>
						</xsl:if>
					</div>
					<div class="ddgrouper ddremovable" dd:btnfloatingstyle="top-right">
						<xsl:if test="$Med/n:routing-information/n:pharmacy"> <!-- There can be at most one pharmacy -->
								<xsl:value-of disable-output-escaping="yes" select="$Pickup"/>
								<xsl:text> </xsl:text> <!-- Placing a space after 'Pickup at'-->
								
								<xsl:call-template name="DisplayPharmacyName">
								<xsl:with-param name="Pharmacy" select="$Med/n:routing-information/n:pharmacy"/>
							</xsl:call-template>
						</xsl:if>
					</div>
				</xsl:if>
				<div class="ddfreetext" dd:refreshid="comments"></div>
			</td>

			<xsl:if test="$ShowNextLast">
				<td style="vertical-align:top; padding:0 5px; border-left:1px solid #000; border-right:1px solid #000;">
					<div class="ddfreetext" dd:refreshid="comments"/>
				</td>
			</xsl:if>
		</tr>

	</xsl:template>

	<xsl:template name="DisplayStatus">
		<xsl:param name="Status"/>
		<xsl:choose>
			<xsl:when test="$Status = 'FILL'">
				<div class="ddfreetext ddgrouper ddremovable" dd:btnfloatingstyle="top-right" dd:discardusertext="true"><span style="font-weight:bold; color:#FF0000; font-style:italic;"><xsl:value-of select="$New"/></span></div>
			</xsl:when>
			<xsl:when test="$Status = 'CONTINUE' or $Status = 'CONTACT_PHYSICIAN'">
				<div class="ddfreetext ddgrouper ddremovable" dd:btnfloatingstyle="top-right" dd:discardusertext="true"><span style="font-weight:bold; color:#FF0000; font-style:italic;"><xsl:value-of select="$Unchanged"/></span></div>
			</xsl:when>
			<xsl:when test="$Status = 'CONTINUE_WITH_CHANGES'">
				<div class="ddfreetext ddgrouper ddremovable" dd:btnfloatingstyle="top-right" dd:discardusertext="true"><span style="font-weight:bold; color:#FF0000; font-style:italic;"><xsl:value-of select="$Changed"/></span></div>
			</xsl:when>
			<xsl:when test="$Status = 'STOP'">
				<div><span style="font-weight:bold; color:#FF0000; font-style:italic;"><xsl:value-of select="$StopTaking"/></span></div>
			</xsl:when>
		</xsl:choose>
	</xsl:template>

    <!-- Template used for displaying the name of the pharmacy in the Instructions column -->
	<xsl:template name="DisplayPharmacyName">
		<xsl:param name="Pharmacy"/>

		<xsl:variable name="Name" as="xs:string">
			<xsl:choose>
				<xsl:when test="$Pharmacy/n:name">
					<xsl:value-of select="$Pharmacy/n:name"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="''"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>


		<xsl:if test="$Name!=''">
			<xsl:value-of select="$Name"/>
		</xsl:if>

	</xsl:template>

	<!-- This is a generic template that takes a report-order-detail element, and returns the information that should be displayed. 
         Report-order-detail elements with the same meaning can potentially have different types.
         This template internally handles the type, so that whoever calling this template can just focus on the correct meaning.
         If new meanings/types are added in the future, they can be appended here.
	-->
	<xsl:template name="GetReportOrderDetail">
		<xsl:param name="ReportOrderDetail"/>

		<xsl:choose>
			<xsl:when test="$ReportOrderDetail[@detail-field-type='DECIMAL']/n:detail-numeric-value/@display">
				<xsl:value-of select="$ReportOrderDetail/n:detail-numeric-value/@display"/>
			</xsl:when>
			<xsl:when test="$ReportOrderDetail[@detail-field-type='CODE']/n:detail-code-value/@patient-friendly-description">
				<xsl:value-of select="$ReportOrderDetail/n:detail-code-value/@patient-friendly-description"/>
			</xsl:when>
			<xsl:when test="$ReportOrderDetail[@detail-field-type='ALPHANUMERIC']/n:detail-text-value">
				<xsl:value-of select="$ReportOrderDetail/n:detail-text-value"/>
			</xsl:when>
			<xsl:when test="$ReportOrderDetail[@detail-field-type='BOOLEAN']/n:detail-indicator-value/@display">
				<xsl:value-of select="$ReportOrderDetail/n:detail-indicator-value/@display"/>
			</xsl:when>
			<xsl:otherwise> <!-- This will log the message to the .err file on the server -->
				<xsl:message terminate="yes">Error: The detail-field-type <xsl:value-of select="$ReportOrderDetail/@detail-field-type"/> is not supported. The detail-field-meaning is <xsl:value-of select="$ReportOrderDetail/@detail-field-meaning"/>.</xsl:message>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

</xsl:stylesheet>