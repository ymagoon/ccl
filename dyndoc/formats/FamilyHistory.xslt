<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="1.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
	xmlns:n="urn:com-cerner-patient-ehr:v3"
	xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
	xmlns:dd="DynamicDocumentation"
	xmlns:java-string="java:java.lang.String"
	exclude-result-prefixes="xsl xs fn n cdocfx java-string">

	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	<xsl:param as="xs:string" name="current-locale" select="'en_US'"/>

	<!-- Required to include CommonFxn.xslt -->
	<!-- Comment out this line to debug -->	<xsl:include href="/cernerbasiccontent/formats/commonfxn.xslt"/>
	<!-- Uncomment this line to debug <xsl:include href="CommonFxn.xslt"/>	-->

	<!-- Including Strings to be used -->
	<xsl:variable as="xs:string" name="PatientAdopted" select="'Patient was adopted'"/>
	<xsl:variable as="xs:string" name="UnableToObtain" select="'Unable to obtain family history'"/>
	<xsl:variable as="xs:string" name="HistoryNegative" select="'Family history is negative'"/>
	<xsl:variable as="xs:string" name="HistoryUnknown" select="'Family history is unknown'"/>
	<xsl:variable as="xs:string" name="DiagnosedDisplay" select="' (Dx %s)'"/>
	<xsl:variable as="xs:string" name="DiagnosedAtDisplay" select="' (Dx at %s)'"/>
	<xsl:variable as="xs:string" name="ConditionPersonListSeparator" select="'%s: '"/>
	<xsl:variable as="xs:string" name="FamilyListOnlyOne" select="'%s.'"/>
	<xsl:variable as="xs:string" name="FamilyListSeparator" select="', %s'"/>
	<xsl:variable as="xs:string" name="FamilyListEnd" select="' and %s.'"/>
	<xsl:variable as="xs:string" name="FamilyMemberDisp" select="'%s%s'"/>
	<xsl:variable as="xs:string" name="NegConditionDisplay" select="'Negative: '"/>
	<xsl:variable as="xs:string" name="FamilyMemberNegative" select="'%s: History is negative'"/>
	<xsl:variable as="xs:string" name="FamilyMemberUnkn" select="'%s: History is unknown'"/>
	
	<!-- Strings from the histories control, NOTE: These MUST match the displays from code set 25320 -->
	<xsl:variable as="xs:string" name="HistCtrlAbout" select="'About'"/>
	<xsl:variable as="xs:string" name="HistCtrlBefore" select="'Before'"/>
	<xsl:variable as="xs:string" name="HistCtrlAfter" select="'After'"/>
	<xsl:variable as="xs:string" name="HistCtrlUnknown" select="'Unknown'"/>

	<!-- Keys -->
	<xsl:key name="keyAllConditions" match="n:report/n:clinical-data/n:family-history-data/n:patient-condition/n:family-relationship/n:condition" use="@nomenclature-id"/>


	<!-- This template is used to create a temporary structure with all of the information needed for the display.
			The structure will contain a list of conditions each with a list of relationships for everyone who has a
			history with that condition (positive or negative). -->
	<xsl:template match="n:report/n:clinical-data/n:family-history-data/n:patient-condition/n:family-relationship/n:condition" mode="preprocessing">

		<condition>
			<xsl:attribute name="name">
				<xsl:value-of select="cdocfx:getNomenclatureDescByID(@nomenclature-id)"/>
			</xsl:attribute>
			<xsl:attribute name="id">
				<xsl:value-of select="@nomenclature-id"/>
			</xsl:attribute>

			<xsl:for-each select="key('keyAllConditions', @nomenclature-id, $root-node)">

				<!-- If multiple names are returned, sort the list by relationship: Self, Mother, Father, Sister, Brother, Daughter, Son, and Child
					followed by any others listed in alphabetical order. In order to do this we assign each of these a sort order number of increasing
					 value and any extras get a sort order of 9999.  When displaying, we sort by number with a secondary sort done alphebetically. -->
				<xsl:variable name="RelationshipMean" select="cdocfx:getCodeMeanByID(../n:related-person/@relationship-code)"/>

				<xsl:element name="relationship">
					<xsl:attribute name="display" select="cdocfx:getFamilyMemberDisplay(.)"/>
					<xsl:attribute name="state" select="@state"/>
					<xsl:attribute name="person-id" select="../n:related-person/@person-id"/>

					<!-- assign the sort order -->
					<xsl:choose>
						<xsl:when test="$RelationshipMean = 'SELF'">
							<xsl:attribute name="sortorder" select="1"/>
						</xsl:when>
						<xsl:when test="$RelationshipMean = 'MOTHER'">
							<xsl:attribute name="sortorder" select="2"/>
						</xsl:when>
						<xsl:when test="$RelationshipMean = 'FATHER'">
							<xsl:attribute name="sortorder" select="3"/>
						</xsl:when>
						<xsl:when test="$RelationshipMean = 'SISTER'">
							<xsl:attribute name="sortorder" select="4"/>
						</xsl:when>
						<xsl:when test="$RelationshipMean = 'BROTHER'">
							<xsl:attribute name="sortorder" select="5"/>
						</xsl:when>
						<xsl:when test="$RelationshipMean = 'DAUGHTER'">
							<xsl:attribute name="sortorder" select="6"/>
						</xsl:when>
						<xsl:when test="$RelationshipMean = 'SON'">
							<xsl:attribute name="sortorder" select="7"/>
						</xsl:when>
						<xsl:when test="$RelationshipMean = 'CHILD'">
							<xsl:attribute name="sortorder" select="8"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:attribute name="sortorder" select="9999"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:element>
			</xsl:for-each>
		</condition>
	</xsl:template>
	
	<!-- This template is used to check whether a family member's history status is set to Negative or Unknown from the drop down. 	-->
	<xsl:template name="FamilyMemberHistory">
		<xsl:for-each select="n:report/n:clinical-data/n:family-history-data/n:patient-condition/n:family-relationship">
			<xsl:if test="count(n:health-status) &gt; 0">
				<xsl:variable name="RelationshipDisplayName" as="xs:string" select="cdocfx:getCodeDisplayByID(n:related-person/@relationship-code)"/>
				<div class="ddemrcontentitem ddremovable" style="padding-left: 1em; text-indent: -1em;margin-left:1em;">
					<xsl:attribute name="dd:entityid"> <!-- This is the relationship-code-->
						<xsl:value-of select="n:related-person/@relationship-code"/>
					</xsl:attribute>
					<xsl:attribute name="dd:contenttype">
						<xsl:text>FAMILYHX</xsl:text>
					</xsl:attribute>
					<xsl:if test="n:health-status = 'NEGATIVE'">
						<xsl:value-of select="java-string:format($FamilyMemberNegative,$RelationshipDisplayName)"/>
					</xsl:if>
					<xsl:if test="n:health-status = 'UNKNOWN'">
						<xsl:value-of select="java-string:format($FamilyMemberUnkn,$RelationshipDisplayName)"/>
					</xsl:if>
				</div>
			</xsl:if>	
		</xsl:for-each>
	</xsl:template>

	<!-- Format the display of a single family member -->
	<!-- NOTE: This does NOT include the commas or any formatting to place it in a comma separated list for displaying -->
	<!-- Parameters: -->
	<!--	currentCondition - the condition to get family members from -->
	<xsl:function name="cdocfx:getFamilyMemberDisplay" as="xs:string">
		<xsl:param name="currentCondition" as="element()?"/>

		<xsl:variable name="display" as="xs:string">

			<xsl:variable name="RelationshipTypeDisp" as="xs:string" select="cdocfx:getCodeDisplayByID($currentCondition/../n:related-person/@relationship-code)"/>

			<!-- Display the condition onset date -->
			<xsl:variable name="OnsetAge" as="xs:string">
				<xsl:choose>
					<xsl:when test="$currentCondition/@onset-age">

						<xsl:choose>
							<xsl:when test="fn:contains($currentCondition/@onset-age, $HistCtrlAbout) or
									fn:contains($currentCondition/@onset-age, $HistCtrlBefore) or
									fn:contains($currentCondition/@onset-age, $HistCtrlAfter)">
								<xsl:variable name="TrimmedOnsetAge" as="xs:string" select="java-string:trim(lower-case($currentCondition/@onset-age))"/>
								<xsl:value-of select="java-string:format($DiagnosedDisplay, $TrimmedOnsetAge)"/>
							</xsl:when>
							<xsl:when test="fn:contains($currentCondition/@onset-age, $HistCtrlUnknown)">
								<!-- We don't want to show anything if the Dx age is marked as unknown -->
								<xsl:value-of select="''"/>
							</xsl:when>
							<xsl:otherwise>
								<!-- This is the case of an exact age.  In this case we want to add the word 'at' to the display. -->
								<xsl:variable name="TrimmedOnsetAge" as="xs:string" select="java-string:trim(lower-case($currentCondition/@onset-age))"/>
								<xsl:value-of select="java-string:format($DiagnosedAtDisplay, $TrimmedOnsetAge)"/>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="''"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:variable>

			<xsl:value-of select="java-string:format($FamilyMemberDisp, ($RelationshipTypeDisp, $OnsetAge))"/>
		</xsl:variable>

		<xsl:value-of select="$display"/>
	</xsl:function>


	<!-- Format the display of a family member for the coma separated list -->
	<!-- Parameters: -->
	<!--	currentCondition - the condition to get family members from -->
	<!--	bIsFirst - Is this the first (or only) family member in the list -->
	<!--	bIsLast - Is this the last (or only) family member in the list -->
	<xsl:function name="cdocfx:displayPerson" as="xs:string">
		<xsl:param name="display" as="xs:string"/>
		<xsl:param name="bIsFirst" as="xs:boolean"/>
		<xsl:param name="bIsLast" as="xs:boolean"/>

		<!-- Decide which display to use -->
		<xsl:if test="$bIsFirst and $bIsLast">
			<!-- This is the only family member -->
			<xsl:value-of select="java-string:format($FamilyListOnlyOne, $display)"/>
		</xsl:if>
		<xsl:if test="$bIsFirst and not($bIsLast)">
			<!-- This is the first of several family members -->
			<xsl:value-of select="$display"/>
		</xsl:if>
		<xsl:if test="not($bIsFirst) and $bIsLast">
			<!-- This is the last of several family members -->
			<xsl:value-of select="java-string:format($FamilyListEnd, $display)"/>
		</xsl:if>
		<xsl:if test="not($bIsFirst) and not($bIsLast)">
			<!-- This is in the middle of a list of several family members -->
			<xsl:value-of select="java-string:format($FamilyListSeparator, $display)"/>
		</xsl:if>
	</xsl:function>


	<!-- Format a list of family members -->
	<!-- Parameters: -->
	<!--	relationshipList - a list of conditions to get family members from -->
	<xsl:template name="tempFormatFamilyMembers">
		<xsl:param name="relationshipList"/>

		<xsl:for-each select="$relationshipList">
			<!-- Sort the relationships by their sortorder with a secondary sort by display so that
				anyone at the same level of sort order will be grouped together by relationship -->
			<xsl:sort select="@sortorder" data-type="number" order="ascending"/>
			<xsl:sort select="@display" order="ascending"/>

			<!-- Create the wrapper for the person -->
			<span class="ddemrcontentitem">
				<xsl:attribute name="dd:entityid">
					<xsl:value-of select="@person-id"/>
				</xsl:attribute>
				<xsl:attribute name="dd:contenttype">
					<xsl:text>FAMILYHX</xsl:text>
				</xsl:attribute>

				<xsl:value-of select="cdocfx:displayPerson(@display, fn:position() = 1, fn:position() = fn:last())"/>
			</span>
		</xsl:for-each>
	</xsl:template>


	<!-- This is the main template -->
	<xsl:template match="/">
		<!-- Checking if patient is adopted -->
		<xsl:if test="n:report/n:clinical-data/n:family-history-data/n:patient-condition[@is-adopted='true']">
			<xsl:choose>
				<!-- Only need to drop down a line if we will display anything else after this point -->
				<xsl:when test="(count(n:report/n:clinical-data/n:family-history-data/n:patient-condition/n:family-relationship/n:condition) &gt; 0) or
								(n:report/n:clinical-data/n:family-history-data/n:patient-condition[@history-status='NEGATIVE' or @history-status='UNKNOWN' or @history-status='UNABLE_TO_OBTAIN']) or (n:report/n:clinical-data/n:family-history-data/n:patient-condition/n:history-status='NEGATIVE' or 'UNKNOWN' or 'UNABLE_TO_OBTAIN')">
					<div style="padding-bottom: .5em;">
						<xsl:value-of select="$PatientAdopted"/>
					</div>
				</xsl:when>
				<xsl:otherwise>
					<div>
						<xsl:value-of select="$PatientAdopted"/>
					</div>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:if>

		<xsl:choose>
			<!-- When there is a family history documented (e.g. related persons with positive or negative conditions) -->
			<xsl:when test="count(n:report/n:clinical-data/n:family-history-data/n:patient-condition/n:family-relationship/n:condition) &gt; 0">

				<!-- This is an alphabetical list of the unique conditions, each with a list of the family members who have a history (positive or negative) with the condition. -->
				<!-- NOTE: This list of conditions does NOT conform to the format specified by the .xsd!  It is a temporary
								 data structure that is easier to work with and contains everything that will be used in the display. -->
				<xsl:variable name="UniqueConditions">
					<xsl:variable name="NomenList" select="fn:distinct-values(n:report/n:clinical-data/n:family-history-data/n:patient-condition/n:family-relationship/n:condition/@nomenclature-id)"/>
					<xsl:apply-templates select="n:report/n:clinical-data/n:family-history-data/n:patient-condition/n:family-relationship/n:condition[@nomenclature-id=$NomenList][generate-id()=generate-id(key('keyAllConditions',@nomenclature-id)[1])]" mode="preprocessing">
						<xsl:sort select="cdocfx:getNomenclatureDescByID(@nomenclature-id)"/>
					</xsl:apply-templates>
				</xsl:variable>

				<xsl:for-each select="$UniqueConditions/condition">

					<!-- Displaying Condition -->
					<div class="ddemrcontentitem ddremovable" style="padding-left: 1em; text-indent: -1em;">
						<xsl:attribute name="dd:entityid">
							<xsl:value-of select="@id"/><!-- This is the nomenclature-id-->
						</xsl:attribute>
						<xsl:attribute name="dd:contenttype">
							<xsl:text>FAMILYHXCOND</xsl:text>
						</xsl:attribute>

						<!-- Display the condition name -->
						<xsl:variable name="conditionName" as="xs:string" select="@name"/>
						<xsl:value-of select="java-string:format($ConditionPersonListSeparator, $conditionName)"/>

						<!-- Display the family members that are positive for the condition -->
						<xsl:variable name="PosConditionList" select="relationship[@state='POSITIVE']"/>
						<xsl:call-template name="tempFormatFamilyMembers">
							<xsl:with-param name="relationshipList" select="$PosConditionList"/>
						</xsl:call-template>

						<!-- Display the family members that are negative for the condition if any exist-->
						<xsl:variable name="NegConditionList" select="relationship[@state='NEGATIVE']"/>
						<xsl:if test="count($NegConditionList) &gt; 0">
							<span style="padding-left: .5em;" />
							<xsl:value-of select="$NegConditionDisplay"/>

							<xsl:call-template name="tempFormatFamilyMembers">
								<xsl:with-param name="relationshipList" select="$NegConditionList"/>
							</xsl:call-template>
						</xsl:if>
					</div>
				</xsl:for-each>
				
				<!-- Display the family member health status which is selected from the drop down -->
				<xsl:if test="n:report/n:clinical-data/n:family-history-data/n:patient-condition/n:family-relationship">
					<xsl:call-template name="FamilyMemberHistory"/>
				</xsl:if>	
			</xsl:when>
			<xsl:when test="n:report/n:clinical-data/n:family-history-data/n:patient-condition[@history-status='NEGATIVE']">
				<div>
					<xsl:value-of select="$HistoryNegative"/>
				</div>
			</xsl:when>
			<xsl:when test="n:report/n:clinical-data/n:family-history-data/n:patient-condition[@history-status='UNKNOWN']">
				<div>
					<xsl:value-of select="$HistoryUnknown"/>
				</div>
			</xsl:when>
			<xsl:when test="n:report/n:clinical-data/n:family-history-data/n:patient-condition[@history-status='UNABLE_TO_OBTAIN']">
				<div>
					<xsl:value-of select="$UnableToObtain"/>
				</div>
			</xsl:when>
			<xsl:when test="n:report/n:clinical-data/n:family-history-data/n:patient-condition/n:history-status">
				<xsl:for-each select="n:report/n:clinical-data/n:family-history-data/n:patient-condition">
					<xsl:if test="n:history-status='NEGATIVE'">
						<div>
							<xsl:value-of select="$HistoryNegative"/>
						</div>
					</xsl:if>
					<xsl:if test="n:history-status='UNKNOWN'">
						<div>
							<xsl:value-of select="$HistoryUnknown"/>
						</div>
					</xsl:if>
					<xsl:if test="n:history-status='UNABLE_TO_OBTAIN'">
						<div>
							<xsl:value-of select="$UnableToObtain"/>
						</div>
					</xsl:if>
				</xsl:for-each>
			</xsl:when>	
			
			<!-- Display the family member health status which is selected from the drop down -->
			<xsl:when test="n:report/n:clinical-data/n:family-history-data/n:patient-condition/n:family-relationship">
				<xsl:call-template name="FamilyMemberHistory"/>
			</xsl:when>
			
			<xsl:otherwise>
				<!-- Don't display anything -->
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>
